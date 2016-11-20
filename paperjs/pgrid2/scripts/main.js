/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global paper, ColorTheme, Point, view, Shape, Path, atob, btoa, ArrayBuffer,
    Uint8Array, Blob, Size, PixelData, Tool, project, Layer, ObjectPool, BlendModes,
    FileDownloader, Utils, MathUtils */

(function () {
    "use strict";
    
    paper.install(window);
    
    var RENDERERS = {
        RECTANGLE:"RECTANGLE",
        TRIANGLE:"TRIANGLE",
        RANDOM:"RANDOM"

    };

    var config = {
        APP_NAME: window.location.pathname.replace(/\//gi, ""),
        BACKGROUND_COLOR: "#FFFFFF",
        CANVAS_BACKGROUND_COLOR:"#FFFFFE",
        CANVAS_WIDTH: 1280,
        CANVAS_HEIGHT: 1280, //16:9 aspect ratio
        SCALE_CANVAS: false,
        TEMPLATE: null,
        ANIMATE: false,
        ALLOW_TEMPLATE_SKEW: false,
        ITEM_WIDTH: 40,
        ITEM_HEIGHT: 40,
        PADDING: 5,
        COLOR_THEME:null,
        MIN_WIDTH:10,
        OPACITY:1.0,
        RENDERER:RENDERERS.RANDOM,
        POINT_COUNT:8
    };

    /*********** Override Config defaults here ******************/
    
    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference
    var bounds;
    var pixelData;
    var colorTheme;

    var main = function(){
    
        colorTheme = new ColorTheme(ColorTheme.themes.BLUE_AND_PINK);


        //start with padding
        //then randomly mover over
        //the putting padding
        //repeart until you get to the end with padding
        createGrid(bounds, config.ITEM_WIDTH, config.ITEM_HEIGHT, config.PADDING);
    };

    var createGrid = function(rectangle, width, height, padding) {
        let colCount = Math.floor((rectangle.width - padding) / (width + padding));
        let rowCount =  Math.floor((rectangle.height - padding) / (height + padding));

        let colOffset = ((rectangle.width - colCount * (width + padding) - padding) / 2);
        let rowOffset = ((rectangle.height - rowCount * (height + padding) - padding) / 2);

        for(let i = 0; i < rowCount; i++) {
            for(let k = 0; k < colCount; k++) {

                var _x = rectangle.x + ((k * width ) + (padding * (k + 1))) + colOffset; 
                var _y = rectangle.y + ((i * height) + (padding * (i + 1))) + rowOffset; 

                var r = new Rectangle(new Point(_x, _y), new Size(width, height));

                /*
                let s = 0; //RECTANGLE

                if(config.RENDERER == RENDERERS.TRIANGLE) {
                    s = 1;
                } else { //RANDOM
                    s = Math.random();
                }

                if(s < 0.5) {
                    createRect(r);
                }
                
                if(s >= 1) {
                    createTriangle(r);
                }

    
                if(r.width < config.MIN_WIDTH) {
                    return;
                }
                */

                createBlob(r);

                createGrid(r, width / 2, height / 2, 2);

                //createMover(r);
            }
        }
    }

    var createBlob = function(r) {

        var points = Utils.randomPointsInCircle(r.center, r.width / 2, config.POINT_COUNT);

        var polygonPoints = Utils.findConvexHull(points);

        var path = new Path({
            segments: [...polygonPoints],
            closed:true,
            strokeColor:colorTheme.getRandomColor(),
            fillColor:colorTheme.getRandomColor(),
            opacity:config.OPACITY
        });

        path.smooth(true);
    }


    var createRect = function(r) {

        var p = new Path.Rectangle(r);
        p.strokeColor = colorTheme.getNextColor();
        p.fillColor = colorTheme.getRandomColor();
        p.strokeWidth = 1.0;
        p.opacity = config.OPACITY;
    }


    var createTriangle = function(r) {
        var _t = new Path();
        _t.add(r.topLeft);
        _t.add(r.topRight);
        _t.add(r.bottomLeft);
        _t.closed = true;
        _t.fillColor = colorTheme.getRandomColor();
        _t.strokeColor = "white";
        _t.opacity = config.OPACITY;

        var _t2 = new Path();
        _t2.add(r.topRight);
        _t2.add(r.bottomRight);
        _t2.add(r.bottomLeft);
        _t2.closed = true;
        _t2.fillColor = colorTheme.getRandomColor();
        _t2.strokeColor = "white";
        _t2.opacity = config.OPACITY;
    }


    //is r passed by reference or copy?
    //can you pass by reference
    var createMover = function(r) {

        r.mover = new Mover(r);
        r.mover.location = Utils.randomPointInBounds(r);
        r.mover.velocity = Utils.randomVector(.5);

        r.circle = new Path.Circle(r.mover.location, 2);
        r.circle.strokeColor = "white";

        r.onFrame = function(event) {
            this.mover.updateAndCheckBounds();

            this.circle.position = this.mover.location;
        }
    }

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

            main();
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

        bounds = view.bounds;

        if(config.TEMPLATE) {
            initTemplate(drawCanvas);
        } else {
            main();
        }
    };

}());