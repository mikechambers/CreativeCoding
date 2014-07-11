/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global paper, ColorTheme, Point, view, Shape, Path, atob, btoa, ArrayBuffer,
    Uint8Array, Blob, Size, PixelData, Tool, project, Layer, ObjectPool, BlendModes */

(function () {
    "use strict";
    
    paper.install(window);
    
    
    var config = {
        BACKGROUND_COLOR: "#eee",
        
        BOUNDS_PADDING: 0,

        TILE_COUNT: 500,
        
        BASE_SIZE: 12,//3, 6,12,24,48 work well with no padding
        CORNER_RADIUS: 0,
        
        BLEND_MODE: BlendModes.NORMAL,
        STROKE_WIDTH: 0.5,
        STROKE_COLOR: "#333333",
        ROTATION_RANGE: 0,
        COLOR_RECTANGLE: true,
        FILL_OPACITY: 1.0,
        RANDOM_SIZE_MODIFIER: 1, //no change
        
        CANVAS_WIDTH: 768,
        CANVAS_HEIGHT: 432, //16:9 aspect ratio
        SCALE_CANVAS: false,
        USE_RANDOM_COLORS: true,
        colorTheme: ColorTheme.themes.TOKYO_TRACK,
        RANDOM_SIZE: false,
        RANDOM_POSITION: false,
        USE_MOUSE: false,
        TEMPLATE: null
    };
    
    /*********** Override Config defaults here ******************/
    
    //config.BACKGROUND_COLOR = "#eee";
    
    
    config.BOUNDS_PADDING = 0;
    config.BASE_SIZE = 24;
    //config.ROTATION_RANGE = 90;
    config.CORNER_RADIUS = 3;
    //config.STROKE_COLOR = null;
    config.FILL_OPACITY = "0.5";
    config.TILE_COUNT = 5000;
    //config.BLEND_MODE = BlendModes.HARD_LIGHT;
    
    //config.RANDOM_SIZE_MODIFIER = 10;
    config.RANDOM_POSITION = true;
    //config.RANDOM_SIZE = true;
    
    config.USE_MOUSE = true;
    
    config.CANVAS_WIDTH = 432;
    config.CANVAS_HEIGHT = 768;
    
    config.TEMPLATE = "templates/isabel.png";
    
    /*************** End Config Override **********************/
    
    var colorTheme = new ColorTheme(config.colorTheme);
    var t; //paperjs tool reference
    var tiles;
    var pixelData;
    
    var backgroundLayer;
    var tileLayer;
    
    var fileNameSuffix = new Date().getTime();
    
    var getColor = function (point) {
                
        if (config.TEMPLATE) {
            return pixelData.getHex(point);
        }
        
        if (!config.colorTheme) {
            return null;
        }
        
        var color;
        if (config.USE_RANDOM_COLORS) {
            color = colorTheme.getRandomColor();
        } else {
            color = colorTheme.getNextColor();
        }
        
        return color;
    };
    
    var getFillColor = function (point) {
        if (!config.COLOR_RECTANGLE) {
            return;
        }
        
        return getColor(point);
    };
    
    var getStrokeColor = function (point) {
        if (config.STROKE_COLOR) {
            return config.STROKE_COLOR;
        }
        
        return getColor(point);
    };
    
    var getRandomPointInView = function () {
        
        var xPadding = config.BOUNDS_PADDING;
        var yPadding = config.BOUNDS_PADDING;
        
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
    
    var createName = function (extension) {
        return "tilegrid_example_" + fileNameSuffix + "." + extension;
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
        
    var downloadAsPng = function () {
        var fileName = createName("png");
        
        var canvas = document.getElementById("myCanvas");
        var url = canvas.toDataURL("image/png");
        downloadFile(url, fileName);
    };
   
    var downloadConfig = function () {
        var fileName = createName("json");
        var url = "data:application/json;utf8," + btoa(JSON.stringify(config, null, "\t"));
        downloadFile(url, fileName);
    };
    
    var downloadAsSVG = function () {

        var fileName = createName("svg");
        
        var url = "data:image/svg+xml;utf8," + btoa(paper.project.exportSVG({asString: true}));
        downloadFile(url, fileName);
    };
    
    var initCanvas = function () {
        var drawCanvas = document.getElementById("myCanvas");
        var canvasW = config.CANVAS_WIDTH;
        var canvasH = config.CANVAS_HEIGHT;
        
        if (config.SCALE_CANVAS) {
            var maxW = window.innerWidth;
            var maxH = window.innerHeight;

            //http://www.ajaxblender.com/howto-resize-image-proportionally-using-javascript.html
            if (canvasH > maxH ||
                    canvasW > maxW) {

                var ratio = canvasH / canvasW;

                if (canvasW >= maxW && ratio <= 1) {
                    canvasW = maxW;
                    canvasH = canvasW * ratio;
                } else if (canvasH >= maxH) {
                    canvasH = maxH;
                    canvasW = canvasH / ratio;
                }
            }
        }
        
        drawCanvas.height = canvasH;
        drawCanvas.width = canvasW;
        
        return drawCanvas;
    };
    

    
    var getRandomRotation = function () {
        
        var a = config.ROTATION_RANGE;
        var r = ((Math.random() * a) - a) + (Math.random() * a);
        
        return r;
    };
    
    var _s;
    var getSize = function () {
        
        if (!config.RANDOM_SIZE && !_s) {
            _s = new Size(config.BASE_SIZE, config.BASE_SIZE);
        }
        
        var s;
        if (!config.RANDOM_SIZE) {
            s = _s;
        } else {
            s = new Size(config.BASE_SIZE - 5, config.BASE_SIZE);
            var modifier = 1;
            
            if (config.RANDOM_SIZE_MODIFIER > 1) {
                modifier = Math.random() * config.RANDOM_SIZE_MODIFIER;
            }
            
            s = s.multiply(Size.random().add(0.75).multiply(modifier)).round();
        }
        return s;
    };
    
    var createRectangle = function (point, size) {
        var rect = new Path.Rectangle({
            point: point,
            size: size,
            fillColor: getFillColor(point),
            strokeColor: getStrokeColor(point),
            strokeWidth: config.STROKE_WIDTH,
            blendMode: config.BLEND_MODE,
            radius: config.CORNER_RADIUS,
            opacity: config.FILL_OPACITY
        });

        if (config.ROTATION_RANGE) {
            rect.rotation = getRandomRotation();
        }
        
        return rect;
    };
    
    var getPointInBounds = function (size) {
        var point = getRandomPointInView();
        var isValid = false;
        while (!isValid) {

            if ((point.x + size.width + config.BOUNDS_PADDING < view.bounds.width) &&
                    (point.y + size.height + config.BOUNDS_PADDING < view.bounds.height)) {
                isValid = true;
            } else {
                point = getRandomPointInView();
            }
        }
        
        return point;
    };
    
    var generateRandomTiles = function () {
        
        var out = [];
        var i;
        var rect;
        var point;
        var size;
        for (i = 0; i < config.TILE_COUNT; i++) {
            
            size = getSize();
            point = getPointInBounds(size);
            
            rect = createRectangle(point, size);
            
            out.push(out);
        }
        
        return out;
    };
    
    var generateTiles = function () {
        
        var out = [];
        var i;
        var rect;
        var point;
        var size;
        
        var row = 0;
        var column = 0;
        var _x;
        var _y;
        
        size = getSize();
        
        var shouldContinue = true;
        while (shouldContinue) {
            
            _x = (column * size.width) + (config.BOUNDS_PADDING * (column + 1));
            
            if (_x + size.width > view.bounds.width) {
                column = 0;
                row++;
            }
            
            _x = (column * size.width) + (config.BOUNDS_PADDING * (column + 1));
            
            _y = row * size.height + (config.BOUNDS_PADDING * (row + 1));
            if (_y + size.height > view.bounds.height) {
                
                shouldContinue = false;
                break;
            }
            
            point = new Point(
                _x,
                _y
            );
            
            rect = createRectangle(point, size);
            
            out.push(out);
            
            column++;
            
        }
        return out;
    };
    
    var initTemplate = function (w, h, callback) {
        
        if (!config.TEMPLATE) {
            callback(false);
            return;
        }
        
        var templateImage = new Image();
        templateImage.onload = function () {

            var canvas = document.createElement("canvas");
            canvas.id = "templateCanvas";
            canvas.width = w;
            canvas.height = h;

            //todo: probably should scale the images depending on canvas size.

            var context = canvas.getContext("2d");
            context.fillStyle = "#000000";
            context.fillRect(0, 0, w, h);

            if (config.ALLOW_TEMPLATE_SKEW) {
                //WARNING: The causes some dithering and adds color to the template
                //pretty much broken right now
                //stretch image to fill entire canvas. This may skew image
                context.drawImage(templateImage, 0, 0, w, h);
            } else {
                //center the image

                var xPos = Math.floor((w - templateImage.width) / 2);
                var yPos = Math.floor((h - templateImage.height) / 2);
                context.drawImage(templateImage, xPos, yPos);
            }

            var imageData = context.getImageData(0, 0, w, h);
            pixelData = new PixelData();
            pixelData.imageData = imageData;

            callback(true);
        };

        templateImage.src = config.TEMPLATE;
    };
    
    window.onload = function () {

        var drawCanvas = initCanvas();

        paper.setup(drawCanvas);

        var backgroundLayer = project.activeLayer;

        //programtically set the background colors so we can set it once in a var.
        document.body.style.background = config.BACKGROUND_COLOR;
        drawCanvas.style.background = config.BACKGROUND_COLOR;

        var rect = new Path.Rectangle(new Point(0, 0),
                            new Size(view.bounds.width, view.bounds.height)
                );

        rect.fillColor = config.BACKGROUND_COLOR;


        initTemplate(drawCanvas.width, drawCanvas.height,
            function () {
                
                t = new Tool();
                
                tileLayer = new Layer();
                
                if (config.RANDOM_POSITION) {
                    generateRandomTiles();
                }
                
                if (!config.USE_MOUSE) {
                    tiles = generateTiles();
                } else {
                    t.minDistance = 10;
                
                    t.onMouseDrag = function (event) {
                        
                        var rect = createRectangle(event.point, getSize());
                        view.update();
                    };
                }
                
                view.update();
                
                //Listen for SHIFT-p to save content as SVG file.
                //Listen for SHIFT-o to save as PNG
                t.onKeyUp = function (event) {
                    if (event.character === "S") {
                        downloadAsSVG();
                    } else if (event.character === "P") {
                        downloadAsPng();
                    } else if (event.character === "J") {
                        downloadConfig();
                    }
                };
            }
            );
        
    };
    
    
}());