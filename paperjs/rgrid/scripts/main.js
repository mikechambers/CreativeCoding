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
        CANVAS_BACKGROUND_COLOR:"#000000",
        CANVAS_WIDTH: 640,
        CANVAS_HEIGHT: 640, //16:9 aspect ratio
        SCALE_CANVAS: false,
        TEMPLATE: "../_templates/masks/mike.gif",
        ANIMATE: false,
        ALLOW_TEMPLATE_SKEW: false,
        MIN_WIDTH:10,
        MAX_WIDTH:100,
        PADDING:2,
        HEIGHT:5,
        INFLUENCE_WIDTH:false,
        OPACITY:1.0
    };
    
    /*********** Override Config defaults here ******************/
    
    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference
    var bounds;
    var pixelData;

    var main = function(){
        
        for(let h = 0; h < config.CANVAS_HEIGHT - config.PADDING;) {

            h += config.PADDING;

            //do we need to take into account padding here?
            if(h + config.HEIGHT > config.CANVAS_HEIGHT - config.PADDING) {
                break;
            }

            for(let w = 0; w < config.CANVAS_WIDTH - config.PADDING;) {

                w += config.PADDING;

                let rW = config.MAX_WIDTH;
                if(config.INFLUENCE_WIDTH) {
                    rW = (config.MAX_WIDTH *  (w / config.CANVAS_WIDTH) + (config.MIN_WIDTH * 2));
                }

                //what happens if these numbers are the same
                let rWidth = Math.round(Utils.getRandomArbitrary(config.MIN_WIDTH, rW));

                let tmp = -1;

                //make sure we are not going over edge
                if(rWidth + w > config.CANVAS_WIDTH - config.PADDING) {
                    tmp = 0;

                //make sure we are not leaving just a small sliver
                } else if (rWidth + w + config.MIN_WIDTH > config.CANVAS_WIDTH - config.PADDING) {
                    tmp = config.MIN_WIDTH;
                }

                if(tmp != -1) {
                     rWidth -= (rWidth + w + tmp) - (config.CANVAS_WIDTH - config.PADDING);
                }

                let p = new Point(w, h);
                let rect = new Rectangle(p, new Size(rWidth, config.HEIGHT));
                
                let r = new Path.Rectangle(rect);
                r.strokeColor = "white";
                r.fillColor = pixelData.getAverageHex(rect);
                r.opacity = config.OPACITY;

                w += rWidth;
            }

            h += config.HEIGHT;
        }

        
        if(config.ANIMATE) {
            view.onFrame = onFrame;
        }
    };

    var onFrame = function(event) {

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
    
    /*
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
    */

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

        let loader = new PixelDataLoader(config.CANVAS_WIDTH, config.CANVAS_HEIGHT);

        loader.load(config.TEMPLATE,
            function(_pixelData){
                pixelData = _pixelData;
                main();
            }
        );
    };

}());