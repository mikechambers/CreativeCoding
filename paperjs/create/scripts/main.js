/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global paper, ColorTheme, Point, view, Shape, Path, atob, btoa, ArrayBuffer,
    Uint8Array, Blob, Size, PixelData, Tool, project, Layer, ObjectPool, BlendModes,
    FileDownloader, Utils, MathUtils */

(function () {
    "use strict";
    
    paper.install(window);
    

    var config = {
        APP_NAME: "mesh",
        BACKGROUND_COLOR: "#333333",
        CANVAS_BACKGROUND_COLOR:"#111111",
        MASK_COLOR: "#FFFFFF",
        STROKE_COLOR:"#FFFFFF",
        CANVAS_WIDTH: 640,
        CANVAS_HEIGHT: 640, //16:9 aspect ratio
        SCALE_CANVAS: false,
        TEMPLATE: null,
        ANIMATE: false,
        ALLOW_TEMPLATE_SKEW: false,
        RADIUS:2,
        //TEMPLATE:"../_templates/mass_2016-04-23-21-11-26-405.png",
        //ALLOW_TEMPLATE_SKEW:true
    };
    
    /*********** Override Config defaults here ******************/
    
    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;
    config.RADIUS = 2;

    config.ANIMATE = true;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference

    var mover;
    var line;
    var svg

    var pixelData;

    var background;
    var bounds;
    var circles = [];

    var colorTheme;
    var main2 = function (_svg) {

        colorTheme = new ColorTheme(ColorTheme.themes.POST_ASTEROID_ENVIRONMENT);


        svg = _svg;
        svg.strokeColor = config.STROKE_COLOR;

        var center = view.center;

        svg.position = center;

        bounds = paper.view.bounds;
        mover = new Mover(bounds);
        mover.velocity = new Point(1, 1);
        mover.location = new Point(0, 0);

        line = new Path.Line(bounds.bottomLeft, bounds.topRight);
        line.strokeColor = "white";

        //line.pivot = mover.location;
        line.location = mover.location;
    }

    var explode = function() {
        var len = circles.length;


        var _onFrame = function() {
            var m = this.mover;
            m.updateAndCheckBounds();
            this.position = m.location;
        }

        for(var i = 0; i < len; i++) {
            var c = circles[i];
            var m = new Mover(bounds);
            m.location = c.position;

            m.setToRandomVelocity(5);

            c.mover = m;

            c.onFrame = _onFrame;
        }
    }

    var onFrame = function() {

        if(!mover) {
            return;
        }

        var hitBounds = mover.updateAndCheckBounds();

        //line.segments[line.segments.length - 1].point = mover.location;
        line.position = mover.location;


        if(hitBounds) {
            mover = null;
            line.remove();

            explode();

            svg.remove();
            svg.fillColor = "white";
            svg.strokeColor = "black";
            //svg.opacity = 0.9;

            project.addLayer(new Layer(svg));

            
            return;
        }




        //y = mx + b
        //0 = -1(x) + b
        //x = b
        var x = mover.location.y + mover.location.x;
        var y = 0;

        if(x <= bounds.right) {
            background.segments[1].point.set(x, y);
            background.segments[2].point.set(x, y);
        } else {

            background.segments[1].point.set(bounds.topRight.x, bounds.topRight.y);

            //y – y1 = m(x – x1)
            x = bounds.right;
            //location.y - y1 = -1(location.x - bounds.right)
            //location.y - y1 = -location.x + bounds.right
            //-y1 = -location.x + bounds.right - location.y;
            y = mover.location.x - bounds.right + mover.location.y;

            background.segments[2].point.set(x, y);

        }

        x = 0;
        y = mover.location.y + mover.location.x;

        if(y <= bounds.bottom) {
            background.segments[3].point.set(x, y);
            background.segments[4].point.set(x, y);
        } else {

            background.segments[4].point.set(bounds.bottomLeft.x, bounds.bottomLeft.y);

            //y – y1 = m(x – x1)
            

            //location.y - bounds.bottom = -1(location.x - x1)
            //location.y - bounds.bottom = -location.x + x1
            //location.y - bounds.bottom + location.x = x1
            x = mover.location.y - bounds.bottom + mover.location.x;
            y = bounds.bottom;
            
            background.segments[3].point.set(x, y);
        }


        //y = mx + b
        //mover.location.y = -1(mover.location.x) + b
        //mover.location.y + mover.location.x = b



        //console.log(line.getIntersections(svg.children.create).length);

        var paths = svg.children.create.children;
        var len = paths.length;

        for(var i = 0; i < len; i++) {
            var path = paths[i];
            var intersections = line.getIntersections(path);

            var len2 = intersections.length;

            if(len2) {
                for(var k = 0; k < len2; k++) {

                    if(Math.random() < 0.1) {
                        //return;
                    } 

                    var p = intersections[k].point;
                    var c = new Path.Circle(p, config.RADIUS);

                    if(pixelData) {
                        c.fillColor = pixelData.getHex(p);;
                    }

                    c.fillColor = colorTheme.getNextColor();

                    c.strokeWidth = 0;

                    //console.log(c);

                    /*
                    c.onFrame = function(event){
                        //this.radius = 300;
                        //console.log(this);
                        //this.radius = 50;
                    }
                    */

                    circles.push(c);
                }
            }
        }



    }

    var main = function(){

        background = new Path();
        //background.strokeColor = "";
        
        background.strokeWidth = 0.0;
        background.fillColor = config.MASK_COLOR;

        background.add(new Point(0,0));//0
        background.add(new Point(0,0));//1 : right
        background.add(new Point(0,0));//2 : right
        background.add(new Point(0,0));//3 : left
        background.add(new Point(0,0));//4 : left

        background.closed = true;

        var svg = project.importSVG("assets/create_something.svg", {
            "expandShapes": true,
            applyMatrix:true,
            onLoad : function(item, rawSVG) {
                main2(item);
            }
        });
    };

    /*********************** init code ************************/

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

        //this might be redundant
        //paper.view.viewSize.height = canvasH;
        //paper.view.viewSize.width = canvasW;
        
        return drawCanvas;
    };
    
    var initTemplate = function(drawCanvas) {
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

            view.update();

        };

        templateImage.src = config.TEMPLATE;
    };

    var fileDownloader;
    window.onload = function () {

        fileDownloader = new FileDownloader(config.APP_NAME);

        var drawCanvas = initCanvas();
        
        paper.setup(drawCanvas);
        
        var backgroundLayer = project.activeLayer;

        //programtically set the background colors so we can set it once in a var.
        document.body.style.background = config.BACKGROUND_COLOR;
        drawCanvas.style.background = config.CANVAS_BACKGROUND_COLOR;
        
        var rect = new Path.Rectangle(new Point(0, 0),
                            new Size(view.bounds.width, view.bounds.height)
                );
        
        rect.fillColor = config.CANVAS_BACKGROUND_COLOR;
      
        if(config.TEMPLATE) {
            initTemplate(drawCanvas);
        }

        t = new Tool();

        //Listen for SHIFT-p to save content as SVG file.
        //Listen for SHIFT-o to save as PNG
        t.onKeyUp = function (event) {
            if (event.character === "S") {
                fileDownloader.downloadSVGFromProject(paper.project);
            } else if (event.character === "P") {
                fileDownloader.downloadImageFromCanvas(drawCanvas);
            } else if (event.character === "J") {
                fileDownloader.downloadConfig(config);
            }
        };

        if(config.ANIMATE) {
            view.onFrame = onFrame;
        }

        main();
    };

}());