/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global paper, ColorTheme, Point, view, Shape, Path, atob, btoa, ArrayBuffer,
    Uint8Array, Blob, Size, PixelData, Tool, project, Layer, ObjectPool, BlendModes,
    FileDownloader, Utils, MathUtils */

(function () {
    "use strict";
    
    paper.install(window);
    

    var config = {
        APP_NAME: "mesh",
        BACKGROUND_COLOR: "#AAAAAA",
        CANVAS_BACKGROUND_COLOR: "#111111",

        CANVAS_WIDTH: 640,
        CANVAS_HEIGHT: 640, //16:9 aspect ratio
        SCALE_CANVAS: false,
        TEMPLATE: null,
        ANIMATE: true,
        ALLOW_TEMPLATE_SKEW: false
    };
    
    /*********** Override Config defaults here ******************/
    
    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference


    var items = [];//{"mover", "line"}

    var main = function(){

        var bounds = paper.view.bounds;

        var m;
        var line;

        var COUNT = 32;

        for(var  i = 0; i < COUNT; i++) {

            var position = new Point();
            var velocity = new Point();

            switch(i % 4) {
                //top
                case 0:
                    position.x = (i + 1) * (bounds.width / COUNT);
                    position.y = bounds.top;

                    velocity.y = 1;
                    break;

                //right
                case 1:
                    position.x = bounds.right;
                    position.y = (i + 1) * (bounds.height / COUNT);

                    velocity.x = -1;
                    break;

                //bottom
                case 2:
                    position.x = (i + 1) * (bounds.width / COUNT);
                    position.y = bounds.bottom;

                    velocity.y = -1;
                    break;
                //left
                case 3:
                    position.x = bounds.left;
                    position.y = (i + 1) * (bounds.height / COUNT);

                    velocity.x = 1;
                    break;
            }

            m = new Mover(bounds);
            m.velocity = velocity;

            //todo: passing a point isnt working here. need to see if
            //it is a bug
            //m.location.set(bounds.leftCenter);
            m.location = position;

            line = new Path.Line(m.location, m.location);
            line.strokeColor = "white";
            //line.strokeWidth = 30;
            //line.opacity = .75;

            items.push({"mover":m, "line":line});
        }

    };

    var circles = [];

    var c;
    var onFrame = function(event) {

        for(var c = 0; c < circles.length; c++) {
            circles[c].remove();
        }

        circles.length = 0;

        var len = items.length;

        for(var i = 0; i < len; i++) {
            var m = items[i].mover;
            var line = items[i].line;

            m.updateAndCheckBounds();

            line.segments[line.segments.length - 1].point = m.location;

            for(var k = 0; k < len; k++) {

                var tmp = items[k].line;

                if(tmp == line) {
                    continue;
                }


                var intersections = line.getIntersections(tmp);

                if(intersections.length) {

                    var p = intersections[0].point;
                    c = new Path.Circle(p, 3);
                    c.fillColor = config.CANVAS_BACKGROUND_COLOR;
                    c.strokeColor = "white";

                    circles.push(c);
                }
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