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

        CANVAS_WIDTH: 640,
        CANVAS_HEIGHT: 640, //16:9 aspect ratio
        SCALE_CANVAS: false,
        TEMPLATE: "../_templates/gradients/gradient_11.jpg",
        MASK_TEMPLATE: "../_templates/masks/tree.gif",
        ANIMATE: true,
        ALLOW_TEMPLATE_SKEW: false,

    };
    
    /*********** Override Config defaults here ******************/
    
    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference
    var bounds;
    let pixelData;
    let maskData;


    let mover;
    let follower;
    let follower2;
    let follower3;
    let follower4;

    var main = function(){

        mover = new Mover(bounds);
        mover.location = Utils.randomPointInBounds(bounds);
        mover.velocity = Utils.randomVector(5.0);
        mover.limit = 100;

        follower = new Follower(mover);
        follower2 = new Follower(follower);
        follower3 = new Follower(follower2);
        follower4 = new Follower(follower3);

        follower.location = Utils.randomPointInBounds(bounds);
        follower2.location = Utils.randomPointInBounds(bounds);
        follower3.location = Utils.randomPointInBounds(bounds);
        follower4.location = Utils.randomPointInBounds(bounds);

        if(config.ANIMATE) {
            view.onFrame = onFrame;
        }
    };

    var onFrame = function(event) {
        let ITERATIONS = 1000;
        for(let i = 0; i < ITERATIONS; i++) {
            
            mover.updateAndCheckBounds();

            follower.update();
            follower2.update();
            follower3.update();
            follower4.update();

            let from = follower.location;
            let to = follower2.location;

            var path = new Path({
                segments: [from, to],
                strokeColor: getGradient(from, to),
                strokeWidth: 1
            })

            from = follower2.location;
            to = follower3.location;

            path = new Path({
                segments: [from, to],
                strokeColor: getGradient(from, to),
                strokeWidth: 1
            })

            from = follower3.location;
            to = follower4.location;

            path = new Path({
                segments: [from, to],
                strokeColor: getGradient(from, to),
                strokeWidth: 1
            })
        }
    };

    var getColor = function(p) {
        if(p.x < 0 || p.x >= config.CANVAS_WIDTH ||
            p.y < 0 || p.y >= config.CANVAS_HEIGHT) {
            return "#FFFFFF";
        }

        //need to have getColor return an actual color instance
        var mask = maskData.getHex(p);

        if(mask == "#ffffff") {
            return "white";
        }

        return pixelData.getHex(p);
    }

    var getGradient = function(from, to) {

        return {
            gradient: {
                stops: [getColor(from), getColor(to)]
            },
            origin: from,
            destination: to
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

        let pdl = new PixelDataLoader(config.CANVAS_WIDTH, config.CANVAS_HEIGHT);

        pdl.load(config.TEMPLATE,
            function(_pd) {
                pixelData = _pd;

                let mdl = new PixelDataLoader(config.CANVAS_WIDTH, config.CANVAS_HEIGHT);

                mdl.load(config.MASK_TEMPLATE,
                    function(_md) {
                        maskData = _md;
                        main();
                    }
                );


            }
            );
        
    };

}());