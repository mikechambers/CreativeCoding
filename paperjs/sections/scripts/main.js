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
        CANVAS_BACKGROUND_COLOR:"white",

        CANVAS_WIDTH: 640,
        CANVAS_HEIGHT: 640, //16:9 aspect ratio
        SCALE_CANVAS: false,
        TEMPLATE: "../_templates/building_3.jpg",
        ANIMATE: false,
        TRACK_MOUSE:false,
        ALLOW_TEMPLATE_SKEW: false,
        DISTANCE_THRESHHOLD:30
    };
    
    /*********** Override Config defaults here ******************/
    
    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference
    var bounds;
    let mousePos;
    let pixelData;

    var main = function(){

        let path = new Path();
        path.strokeColor = "black";

        for(let i = 0; i < 25; i++){
            //todo: should we have this return a pixel snapped point?
            let p = Utils.randomPointInBounds(bounds, 100);

            path.add(p);



            p.x = Math.round(p.x);
            p.y = Math.round(p.y);

            let topLeft = p.subtract(config.DISTANCE_THRESHHOLD);
            let bottomRight = p.add(config.DISTANCE_THRESHHOLD);

            var s = new Size(1,1);
            for(let y = topLeft.y; y < bottomRight.y; y++) {
         
                for(let x = topLeft.x; x < bottomRight.x; x++) {
                    let _p = new Point(x,y);
                    let r = new Path.Rectangle(_p, s);
                    r.fillColor = pixelData.getHex(_p);
                    //r.blendMode = "multiply";

                    let dist = 1 - (_p.getDistance(p) / config.DISTANCE_THRESHHOLD);

                    if(dist < 0) {
                        dist = 0;
                    } else {
                        dist = 0.5;
                    }

                    r.opacity = dist;
                }
            }

            let c = new Path.Circle(p, 2);
            c.strokeColor = "black";

            let c2 = new Path.Circle(p, config.DISTANCE_THRESHHOLD);
            c2.strokeColor = "black";
        }


        if(config.ANIMATE) {
            view.onFrame = onFrame;
        }
    };

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

        let pdl = new PixelDataLoader(config.CANVAS_WIDTH, config.CANVAS_HEIGHT);

        pdl.load(config.TEMPLATE,
            function(pd) {
                pixelData = pd;
                main();
            }
        )
    };

}());