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
        CANVAS_BACKGROUND_COLOR:"#FFFFFF",
        STROKE_COLOR:"#333333",
        CANVAS_WIDTH: 640,
        CANVAS_HEIGHT: 640, //16:9 aspect ratio
        SCALE_CANVAS: false,
        TEMPLATE: null,
        ANIMATE: false,
        TRACK_MOUSE:false,
        ALLOW_TEMPLATE_SKEW: false,
        PADDING:10,
        MAX_DEPTH:10,
        STROKE_WIDTH:1.0,
        MIN_DIMENSION:20
    };
    
    /*********** Override Config defaults here ******************/
    
    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference
    var bounds;
    let mousePos;

    var main = function(){
        
        let mainRect = new Rectangle(
            config.PADDING, 
            config.PADDING,
            bounds.width - (config.PADDING * 2),
            bounds.height - (config.PADDING * 2)
        );

        let rectPath = new Path.Rectangle(mainRect);
        rectPath.strokeColor = config.STROKE_COLOR;
        rectPath.strokeWidth = config.STROKE_WIDTH;

        splitRect(mainRect);

        if(config.ANIMATE) {
            view.onFrame = onFrame;
        }
    };


    var splitRect = function(rect, depth = 1) {

        let rect1 = new Rectangle();
        let rect2 = new Rectangle();

        let divisor = Utils.getRandomInclusive(2, 5);

        let p1;
        let p2;

        rect1.x = rect.x;
        rect1.y = rect.y;

        if(Math.random() > 0.5) {

            rect1.width = rect.width / divisor;
            rect1.height = rect.height;

            rect2.x = rect1.x + rect1.width;
            rect2.y = rect.y;
            rect2.width = rect.width - rect1.width;
            rect2.height = rect.height;

            p1 = rect2.topLeft;
            p2 = rect2.bottomLeft;

        } else {

            rect1.width = rect.width;
            rect1.height = rect.height  / divisor;

            rect2.x = rect.x;
            rect2.y = rect1.y + rect1.height;
            rect2.width = rect.width;
            rect2.height = rect.height - rect1.height;

            p1 = rect2.topLeft;
            p2 = rect2.topRight;
        }

        let p = new Path.Line(p1, p2);
        p.strokeColor = config.STROKE_COLOR; 
        p.strokeWidth = config.STROKE_WIDTH;

        depth++;

        if(depth > config.MAX_DEPTH) {
            return;
        }

        splitRect(rect1, depth);
        splitRect(rect2, depth);

    }

    let f = chroma.scale(["blue", "green"]);
    var drawRect = function(rect, depth) {

        let r = new Path.Rectangle(rect);
        r.fillColor = f((depth / config.MAX_DEPTH)).hex();
        //console.log(f((depth / config.MAX_DEPTH)).hex());

    }

    var onFrame = function(event) {

    };

    var onMouseMove = function(event) {
        mousePos = event.point; 
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

    var fileDownloader;
    window.onload = function () {

        fileDownloader = new FileDownloader(config.APP_NAME);

        var drawCanvas = initCanvas();
        
        paper.setup(drawCanvas);
        
        var backgroundLayer = project.activeLayer;

        //programtically set the background colors so we can set it once in a var.
        document.body.style.background = config.BACKGROUND_COLOR;
        drawCanvas.style.background = config.CANVAS_BACKGROUND_COLOR;
        
        bounds = view.bounds;

        var rect = new Path.Rectangle(bounds);
        
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

        if(config.TRACK_MOUSE) {
            t.onMouseMove = onMouseMove;
        }

        main();
    };

}());