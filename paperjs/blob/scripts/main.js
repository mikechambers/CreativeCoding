/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global paper, ColorTheme, Point, view, Shape, Path, atob, btoa, ArrayBuffer,
    Uint8Array, Blob, Size, PixelData, Tool, project, Layer, ObjectPool, BlendModes,
    FileDownloader, Utils, MathUtils */

(function () {
    "use strict";
    
    paper.install(window);
    

    var config = {
        APP_NAME: "blob",
        BACKGROUND_COLOR: "#111111",
        CANVAS_BACKGROUND_COLOR:"#FFFFFF",
        CANVAS_WIDTH: 640,
        CANVAS_HEIGHT: 640, //16:9 aspect ratio
        SCALE_CANVAS: false,
        TEMPLATE: null,
        ANIMATE: true,
        ALLOW_TEMPLATE_SKEW: false,
        POINT_COUNT:100,
        BOUNDS_PADDING:200,
        MAX_PATHS:150,
        MAX_RADIUS:200,
        MIN_RADIUS:1,
        USE_FILL:false,
        MAX_OPACITY:1,
        SHAPE_OUTLINE: false
    };
    
    /*********** Override Config defaults here ******************/
    
    config.TEMPLATE = "../_templates/gradients/gradient_12.png";
    config.MAX_PATHS = 46;
    config.MAX_RADIUS = 236;
    config.MIN_RADIUS = 150;
    config.POINT_COUNT = 5
    config.USE_FILL = true;
    config.MAX_OPACITY = .25;
    config.POINT_COUNT = 10;
    config.SHAPE_OUTLINE = true;

    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference
    var bounds;
    var pixelData;

    var points;

    var paths = [];

    var main = function(){

    };

    var radius  = config.MAX_RADIUS;
    var dir = 1;
    var onFrame = function(event) {

        if(!pixelData) {
            return;
        }

        points = [];

        radius += (dir * 1);

        if(radius > config.MAX_RADIUS || radius < config.MIN_RADIUS) {
            dir *= -1;
        }

        var points = Utils.randomPointsInCircle(bounds.center, radius, config.POINT_COUNT);

        var polygonPoints = Utils.findConvexHull(points);


        var path = new Path({
            segments: [...polygonPoints],
            closed:true,
        });

        path.strokeColor = pixelData.getHex(new Point(bounds.center.x, bounds.center.y - radius));

        if(config.USE_FILL) {
            path.fillColor = path.strokeColor;
        }

        if(config.SHAPE_OUTLINE) {
            path.strokeColor = "black";
        }

        paths.unshift(path);

        var len = paths.length;

        for(let k = 0; k < len; k++) {
            var _path = paths[k];

            var o = (config.MAX_OPACITY - (k / config.MAX_PATHS));

            if(o <= 0 ) {
                o = 0;
                _path.remove();
            }

            _path.opacity = o;

        }

        if(paths.length > config.MAX_PATHS ) {
            paths.length = config.MAX_PATHS ;
        }

        path.smooth();
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
			
            pixelData = new PixelData(imageData);
            //pixelData.imageData = imageData;

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

        bounds = view.bounds;
        main();
    };

}());