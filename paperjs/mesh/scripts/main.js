/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global paper, ColorTheme, Point, view, Shape, Path, atob, btoa, ArrayBuffer, Uint8Array, Blob, Size, PixelData, Tool */

(function () {
    "use strict";
    
    paper.install(window);
    
    var BACKGROUND_COLOR = "#222222";

    var ANIMATE = false;
    var DRAW_RADIUS_POINTS = false;
    
    var RADIUS = 10;
    
    //radius * 2
    var BOUNDS_PADDING = 100;
    var CIRCLE_COUNT = 20;//3000
    var MAX_NEIGHBOR_COUNT = 5;//30
    var FIND_NEAREST_NEIGHBOR = true;
    
    var OPACITY = 0.5;
    var STROKE_COLOR = "white";
    
    //soft-light, hard-light, difference, color-dodge
    var BLEND_MODE = "soft-light";
    var CIRCLE_BLENDMODE = "normal";
    var STROKE_WIDTH = 0.2;
    
    var TEMPLATE = "templates/blank_template.gif";
    
    var colorTheme = new ColorTheme(ColorTheme.themes.BLUE_AND_PINK);
    
    //whether or not the template can be skewed to fill the entire canvas.
    //if false, the template will be placed in the center of the canvas
    var ALLOW_TEMPLATE_SKEW = true;
    
    
    var circleGroups = {};
    var paths;
    var t; //paperjs tool reference
    var circlesStore;
    var pixelData;
    
    var randomVectorValue = function () {

        var v = Math.random();

        if (v === 0) {
            v = -1;
        }
        
        v += 0.25; //minimum speed
        
        if (Math.random() < 0.5) {
            v *= -1;
        }

        return v;
    };
    
    var getRandomPointInView = function (xPadding, yPadding) {
        var point = new Point(
            Math.floor(Math.random() * view.bounds.width),
            Math.floor(Math.random() * view.bounds.height)
        );
        
        if (xPadding || yPadding) {
            if (point.x < xPadding) {
                point.x = xPadding;
            } else if (point.x > view.bounds.width - xPadding) {
                point.x = view.bounds.width - xPadding;
            }
            
            if (point.y < yPadding) {
                point.y = yPadding;
            } else if (point.y > view.bounds.height - yPadding) {
                point.y = view.bounds.height - yPadding;
            }
        }
        
        return point;
    };
    
    var createCircle = function (point, radius) {
        
        if (!radius) {
            radius = RADIUS;
        }
        
        if (!point) {
            point = getRandomPointInView(BOUNDS_PADDING, BOUNDS_PADDING);
        }

        //note: you can use the syntax above, but I am trying to keep object creation
        //down
        var circle = new Shape.Circle(point, radius);
        circle.blendMode = CIRCLE_BLENDMODE;
        circle.strokeColor = STROKE_COLOR;
        circle.fillColor = colorTheme.getRandomColor();
        
        
        circle.vector = new Point(randomVectorValue(), randomVectorValue());

        circle.opacity = OPACITY;
        
        if (ANIMATE) {
            circle.onFrame = function () {
                
                var SPEED = 4;
                this.position.x += this.vector.x * SPEED;
                this.position.y += this.vector.y * SPEED;
                if (this.position.y < 0) {
                    this.vector.y *= -1;
                    this.position.y = 0;
                } else if (this.position.y + this.bounds.height > view.bounds.height) {
                    this.vector.y *= -1;
                    this.position.y = view.bounds.height - this.bounds.height;
                }
                
                if (this.position.x < 0) {
                    this.vector.x *= -1;
                    this.position.x = 0;
                } else if (this.position.x + this.bounds.width > view.bounds.width) {
                    this.vector.x *= -1;
                    this.position.x = view.bounds.width - this.bounds.width;
                }
            };
        }

        return circle;
    };

    var getDistanceBetweenPoints = function (p1, p2) {

        var _x = p2.x - p1.x;
        var _y = p2.y - p1.y;
        
        return Math.sqrt(_x * _x + _y * _y);
    };
    
    var _distanceSort = function (a, b) {
        return a.distance - b.distance;
    };
    
    var _sorted = [];
    var findClosestNeighbors = function (circle, circles) {
        var count = MAX_NEIGHBOR_COUNT;

        var circlesLen = circles.length;
        if (count >= circlesLen) {
            count = circlesLen - 1;
        }
        
        var c;
        var dist;
        var hash = {};
        
        var i;
        for (i = 0; i < circlesLen; i++) {
            c = circles[i];
            
            //todo: strict equality
            if (c === circle) {
                continue;
            }
            
            dist = getDistanceBetweenPoints(c.position, circle.position);
            
            //This hashes on the PaperJS naming for each Circle instance
            //we can't hash on the distance (which would be faster), because it is possible 
            //there will be a duplicate
            //todo: this is potentially creating 10s of thousands of temp objects, so we would consinder
            //creating a rool for it.
            hash[c.toString()] = {distance: dist, circle: c};
        }
        
        var key;
        for (key in hash) {
            _sorted.push(hash[key]);
        }
        
        _sorted.sort(_distanceSort);
        
        if (!FIND_NEAREST_NEIGHBOR) {
            _sorted.reverse();
        }
        
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = _sorted[i].circle;
        }

        //reset and reuse array to save on garbage collection
        //http://stackoverflow.com/a/1232046
        while (_sorted.length > 0) {
            _sorted.pop();
        }
        
        return out;
    };
    
    function getLineAngle(p1, p2) {
        //http://stackoverflow.com/questions/9614109/how-to-calculate-an-angle-from-points
        //get the angle of the line
        var dy = p2.y - p1.y;
        var dx = p2.x - p1.x;
        var angle = Math.atan2(dy, dx);
        
        return angle;
    }
    
    function getRadiusPoint(c1, c2) {
        
        var p1 = c1.position;
        var p2 = c2.position;
        var radius = c1.radius;

        var angle = getLineAngle(p1, p2);
        //figure out the point on the circle, based on the angle.
        //this returns the point, relative to (0,0)
        var p3 = new Point();
        p3.x = Math.cos(angle) * radius;
        p3.y = Math.sin(angle) * radius;
        
        //need to shift for the center of the circle
        p3.x = p3.x + p1.x;
        p3.y = p3.y + p1.y;
        
        return p3;
    }
    
    var cp;
    var connectCircles = function (circles) {
        
        var c1;
        var c2;
        var neighbors;
        var len;
        var circleLen = circles.length;
    
        var k;
        for (k = 0; k < circleLen; k++) {
            c1 = circles[k];
            
            neighbors = findClosestNeighbors(c1, circles);
 
            len = neighbors.length;
            
            var path = new Path();
            path.strokeColor = STROKE_COLOR;
            path.strokeWidth = STROKE_WIDTH;
            path.blendMode = BLEND_MODE;
            
            path.fillColor = colorTheme.getRandomColor();
            path.moveTo(c1.position);
            
            var i;
            for (i = 0; i < len; i++) {
                c2 = neighbors[i];
                path.lineTo(c2.position);
            }
            
            path.lineTo(c1.position);
        }
    };
    
    var connectAllCircles = function () {
        paths = [];
        
        var key;
        for (key in circleGroups) {
            connectCircles(circleGroups[key]);
        }
    };

    //we could see if the sting is base 64 encoded, if not, assume its is a string
    //http://stackoverflow.com/a/5100158
    var dataURItoBlob = function (dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        
        var len = byteString.length;
        
        var i;
        for (i = 0; i < len; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var bb = new Blob([ab], {type: mimeString});
        return bb;
    };
    
    var downloadFile = function (url, fileName) {

        var bb = dataURItoBlob(url);
        
        window.URL = window.URL || window.webkitURL;
        
        //http://html5-demos.appspot.com/static/a.download.html
        //https://developer.mozilla.org/en-US/docs/Web/API/Blob
        var a = document.createElement('a');
        a.download = fileName;
        a.href = window.URL.createObjectURL(bb);
        a.click();
    };
    
    var downloadAsPng = function (fileName) {
        if (!fileName) {
            fileName = "paperjs_example.png";
        }
        
        var canvas = document.getElementById("myCanvas");
        var url = canvas.toDataURL("image/png");
        downloadFile(url, fileName);
    };
    
    var downloadAsSVG = function (fileName) {
        
        if (!fileName) {
            fileName = "paperjs_example.svg";
        }
        
        var url = "data:image/svg+xml;utf8," + btoa(paper.project.exportSVG({asString: true}));
        downloadFile(url, fileName);
    };
    
    var groupCircles = function (circles) {
        
        circleGroups = {};
        
        var circle;
        var len = circles.length;
        
        var i;
        for (i = 0; i < len; i++) {
            circle = circles[i];
            
            var group = pixelData.getHex(circle.position);

            if (!circleGroups[group]) {
                circleGroups[group] = [];
            }
        
            circleGroups[group].push(circle);
        }

    };
    
    window.onload = function () {
        // Setup directly from canvas id:
        paper.setup('myCanvas');
        
        var drawCanvas = document.getElementById("myCanvas");

        //programtically set the background colors so we can set it once in a var.
        document.body.style.background = BACKGROUND_COLOR;
        drawCanvas.style.background = BACKGROUND_COLOR;
        
        
        //todo: note, right now, this doesnt handle if the browser window is resized.
        var rect = new Path.Rectangle(new Point(0, 0),
                            new Size(view.bounds.width, view.bounds.height)
                                     );
        rect.fillColor = BACKGROUND_COLOR;
        
        var w = drawCanvas.width;
        var h = drawCanvas.height;
        var templateImage = new Image();
        templateImage.onload = function () {
                
            var canvas = document.createElement("canvas");
            canvas.id = "templateCanvas";
            canvas.width = w;
            canvas.height = h;
            
            //todo: probably should scale the images depending on canvas size.
            
            var context = canvas.getContext("2d");
            context.fillStyle = "#000000";
            context.fillRect(0, 0, h, w);

            if (ALLOW_TEMPLATE_SKEW) {
                //stretch image to fill entire canvas. This may skew image
                context.drawImage(templateImage, 0, 0, w, h);
            } else {
                //center the image
                var xPos = (w - templateImage.width) / 2;
                var yPos = (h - templateImage.height) / 2;
                context.drawImage(templateImage, xPos, yPos);
            }
            
            var imageData = context.getImageData(0, 0, w, h);
            pixelData = new PixelData();
            pixelData.imageData = imageData;
            
            circlesStore = [];
            
            var i;
            for (i = 0; i < CIRCLE_COUNT; i++) {
                circlesStore.push(createCircle());
            }

            groupCircles(circlesStore);

            connectAllCircles();

            view.onFrame = function () {
                if (ANIMATE) {
                    groupCircles(circlesStore);
                    connectAllCircles();
                }

                //this fixes an issue where sometimes the view won't render until a browser
                //event (mouse over, etc...)
                paper.view.update();
            };

            t = new Tool();

            //Listen for SHIFT-p to save content as SVG file.
            //Listen for SHIFT-o to save as PNG
            t.onKeyUp = function (event) {
                if (event.character === "P") {
                    downloadAsSVG();
                } else if (event.character === "O") {
                    downloadAsPng();
                }
            };
        };
            
        templateImage.src = TEMPLATE;
    };
}());