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
        CANVAS_BACKGROUND_COLOR:"#111111",

        CANVAS_WIDTH: 640,
        CANVAS_HEIGHT: 640, //16:9 aspect ratio
        SCALE_CANVAS: false,
        TEMPLATE: null,
        ANIMATE: true,
        TRACK_MOUSE:true,
        ALLOW_TEMPLATE_SKEW: false,
        LINE_LENGTH:500,
        BRUSH_COUNT:30,
        BRUSH_SIZE:10,
        DRAW_GUIDES:true
    };
    
    /*********** Override Config defaults here ******************/
    
    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference
    var bounds;
   
    let mousePos;

    let centerCircle;
    let mouseCircle;
    let anchorCircle;

    let markerCircles = [];

    const HALF_PI = Math.PI / 2

    var main = function(){

        centerCircle = new Path.Circle(bounds.center, 4);
        centerCircle.fillColor = "white";

        mouseCircle = new Path.Circle(bounds.center, 10);
        mouseCircle.strokeColor = "white";

        if(config.ANIMATE) {
            view.onFrame = onFrame;
        }
    };

    var controlLine;
    var onFrame = function(event) {

        mouseCircle.position = mousePos;

        if(!markerCircles.length) {
            initMarkers(config.BRUSH_COUNT);
        }

        //this is the anchor for the line we are trying to make
        let anchorPoint = MathUtils.getPointExtendedFromLine(mouseCircle.position, centerCircle.position, 50);

        if(!anchorCircle) {
            anchorCircle = new Path.Circle(anchorPoint, 2);
            anchorCircle.fillColor = "white";
        } else {
            anchorCircle.position = anchorPoint;
        }

        for(let i = 0; i < config.BRUSH_COUNT; i++){
           let a = markerCircles[i];

            a.position = 
                Utils.pointOnCircle(
                    anchorPoint, ((i * (config.LINE_LENGTH / config.BRUSH_COUNT)) + ((config.LINE_LENGTH / config.BRUSH_COUNT) / 2)) - (config.LINE_LENGTH / 2),
                    MathUtils.angleBetweenPoints(centerCircle.position, mouseCircle.position) - HALF_PI
                );
        }

        if(config.DRAW_GUIDES) {
            if(!controlLine) {
                controlLine = new Path.Line({
                    from: mouseCircle.position,
                    to: anchorPoint,
                    strokeColor: 'white'
                });
            }

            controlLine.firstSegment.point = mouseCircle.position;
            controlLine.lastSegment.point = anchorPoint;
        }
    };

    var initMarkers = function(count){

        for(let i = 0; i < count; i++){
           let aPoint = new Path.Circle(bounds.center, config.BRUSH_SIZE);
            aPoint.strokeColor = "white";
            //aPoint.fillColor = "white";
            aPoint.opacity = 0.8;

            markerCircles.push(aPoint);
        }
    }

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