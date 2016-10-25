/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global paper, ColorTheme, Point, view, Shape, Path, atob, btoa, ArrayBuffer,
    Uint8Array, Blob, Size, PixelData, Tool, project, Layer, ObjectPool, BlendModes,
    FileDownloader, Utils, MathUtils */

(function () {
    "use strict";
    
    paper.install(window);
    

    var SHAPE_TYPES = {
        RECTANGLE:"RECTANGLE",
        CIRCLE:"CIRCLE"
    };

    var config = {
        APP_NAME: "target2",
        BACKGROUND_COLOR: "#AAAAAA",
        CANVAS_BACKGROUND_COLOR: "#FFFFFF",
        LINE_STROKE_COLOR: "#CCCCCC",
        CIRCLE_FILL_COLOR: "#FFFFFF", //white (ignored if template is used)

        CANVAS_WIDTH: 640,
        CANVAS_HEIGHT: 640, //16:9 aspect ratio
        SCALE_CANVAS: false,
        TEMPLATE: null,
        ANIMATE: true,
        ALLOW_TEMPLATE_SKEW: false,
        LINE_COUNT: 32, //should be a factor of 4
        MAX_VELOCITY: 10,
        CIRCLE_RADIUS: 4,
        SHAPE_TYPE: SHAPE_TYPES.CIRLCE, //rectangle, circle, or null
        DEFAULT_VELOCITY: 20
    };
    
    /*********** Override Config defaults here ******************/
    
    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;

    config.TEMPLATE = "../_templates/mass_2016-04-23-21-11-26-405.png";
    config.ALLOW_TEMPLATE_SKEW = true;

    config.LINE_COUNT = 320;
    config.LINE_STROKE_COLOR = "black";//config.CANVAS_BACKGROUND_COLOR;
    config.CIRCLE_RADIUS = 3;
    config.SHAPE_TYPE = SHAPE_TYPES.RECTANGLE;
    config.DEFAULT_VELOCITY = 20;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference


    var movers = [];//{"mover", "line"}
    var activeMover;
    var completedMovers = [];

    var bounds;
    var main = function(){

        bounds = paper.view.bounds;

        var m;
        var line;

        for(var  i = 0; i < config.LINE_COUNT; i++) {

            var position = new Point();
            var velocity = new Point();

            switch(i % 4) {
                //top
                case 0:

                    position.x = (i + 1) * (bounds.width / config.LINE_COUNT);
                    position.y = bounds.top;

                    //velocity.y = 1 * (Math.random() * config.MAX_VELOCITY);
                    velocity.y = config.DEFAULT_VELOCITY;
                    break;

                //right
                case 1:
                    position.x = bounds.right;
                    position.y = (i) * (bounds.height / config.LINE_COUNT);

                    //velocity.x = -1 * (Math.random() * config.MAX_VELOCITY);
                    velocity.x = -config.DEFAULT_VELOCITY;
                    break;

                //bottom
                case 2:
                    position.x = (i - 1) * (bounds.width / config.LINE_COUNT);
                    position.y = bounds.bottom;

                    //velocity.y = -1 * (Math.random() * config.MAX_VELOCITY);
                    velocity.y = -config.DEFAULT_VELOCITY;
                    break;
                //left
                case 3:
                    position.x = bounds.left;
                    position.y = (i - 2) * (bounds.height / config.LINE_COUNT); // note its i, so we dont end on edge

                    //velocity.x = 1 * (Math.random() * config.MAX_VELOCITY);
                    velocity.x = config.DEFAULT_VELOCITY;
                    break;
            }

            m = new Mover(bounds);
            m.velocity = velocity;

            //todo: passing a point isnt working here. need to see if
            //it is a bug
            //m.location.set(bounds.leftCenter);
            m.location = position;

            line = new Path.Line(m.location, m.location);
            //line.strokeColor = config.CANVAS_BACKGROUND_COLOR;
            line.strokeColor = config.LINE_STROKE_COLOR;
            //line.strokeWidth = 30;
            //line.opacity = .75;

            m.line = line;

            movers.push(m);
        }

        movers = Utils.shuffle(movers);
        activeMover = movers.pop();

    };

    var onFrame = function(event) {

        if(!activeMover) {
            return;
        }

        var line = activeMover.line;

        var hitBounds = activeMover.updateAndCheckBounds();

        if(hitBounds) {
            completedMovers.push(activeMover);
            activeMover = movers.pop();
            return;
        }

        line.segments[line.segments.length - 1].point = activeMover.location;

        var count = 0;
        var len = completedMovers.length;
        for(var i = 0; i < len; i++) {
            var m = completedMovers[i];
            var l = m.line;

            var intersections = line.getIntersections(l);

            if(intersections.length > 1)
                console.log(intersections.length);

            if(intersections.length) {
                //we hit something. stop

                count++;

                if(count < Math.ceil(Math.random() * (config.LINE_COUNT / 4))) {
                    continue;
                }

                var p = intersections[intersections.length - 1].point;
                line.segments[line.segments.length - 1].point = p;

                var c = new Path.Circle(p, config.CIRCLE_RADIUS);

                if(p.x < bounds.right && p.y < bounds.bottom && p.y > 0 && p.x > 0) {
                    c.fillColor = pixelData.getHex(p);
                }


                c.strokeColor = config.LINE_STROKE_COLOR;

                completedMovers.push(activeMover);
                activeMover = movers.pop();
                return;
            }

        }

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
    
    var pixelData;
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