/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global paper, ColorTheme, Point, view, Shape, Path, atob, btoa, ArrayBuffer,
    Uint8Array, Blob, Size, PixelData, Tool, project, Layer, ObjectPool, BlendModes,
    FileDownloader, Utils, MathUtils */

(function () {
    "use strict";
    
    paper.install(window);
    

    var config = {
        APP_NAME: window.location.pathname.replace(/\//gi, ""),
        BACKGROUND_COLOR: "#FFFFFF",
        CANVAS_BACKGROUND_COLOR:"#555555",
        STROKE_COLOR:"white",
        OPACITY:1.0,
        CANVAS_WIDTH: 640,
        CANVAS_HEIGHT: 640, //16:9 aspect ratio
        SCALE_CANVAS: false,
        TEMPLATE: null,
        ANIMATE: false,
        ALLOW_TEMPLATE_SKEW: false,
        SELECTED: false,
        POINT_DENSITY: 48,
        MOVEMENT_COEFFICIENT:.005, //high = faster
        SMOOTH:true,
        COUNT:40,
        RADIUS_BASE:25,
        BLEND_MODE:BlendModes.NORMAL
    };
    
    /*********** Override Config defaults here ******************/
    
    config.OPACITY = 1.0;
    config.TEMPLATE = "../_templates/gradients/gradient_12.png"
    config.BACKGROUND_COLOR = "#111111";
    config.CANVAS_BACKGROUND_COLOR = "#FFFFFF";
    //config.STROKE_COLOR = undefined;
    config.COUNT = 25;
    config.RADIUS_BASE = 15;

    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference
    var bounds;
    var pixelData;
    var colorTheme;

    function compoundSin(num) {
        return (Math.sin(num) + Math.sin((2.2 * num)+ 5.52) + Math.sin((2.9 * num)+0.93) + Math.sin((4.6*num)+8.94)) / 4;
    }

    var main = function(){
        colorTheme = new ColorTheme(ColorTheme.themes.BLUE_GREY);

        
        view.onFrame = onFrame;
    };

    var frame = 0;
    var onFrame = function(event) {

        project.activeLayer.remove();

        //drawShape(150, ColorTheme.themes.BLUE[2]);
        //drawShape(50, ColorTheme.themes.BLUE[4]);

        config.OPACITY = 1;
        //for(let i = 0; i < config.COUNT; i++) {
        for(let i = config.COUNT; i > 0; i--) {
            var radius = (i * 10) + config.RADIUS_BASE;
            var color = pixelData.getHex(bounds.center.add(new Point(0, -radius)));

            config.OPACITY =  1 - (i / config.COUNT);
            drawShape(radius, color);
        }

        frame += config.MOVEMENT_COEFFICIENT;
    };

    var drawShape = function(radius, color) {
        var center = bounds.center;
        var spacing = config.POINT_DENSITY;
        var steps = Math.floor(Utils.circumference(radius) / (spacing));

        var path;
        for(let i = 0; i < steps; i++) {

            var a = (Math.PI * 2) / steps;
            var p = Utils.pointOnCircle(center, radius + (compoundSin(i + frame) * 30) , a * i);    

            if(!path) {
                path = new Path(p);
                path.strokeColor = config.STROKE_COLOR;
                path.fillColor = color;
                path.opacity = config.OPACITY;
                path.blendMode = config.BLEND_MODE;
                path.closePath();
            } else {
                path.add(p);

                if(config.SMOOTH) {
                    path.smooth();
                }
            }

            if(config.SELECTED) {
                path.selected = true;
            }
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