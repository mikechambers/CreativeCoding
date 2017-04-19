/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global paper, ColorTheme, Point, view, Shape, Path, atob, btoa, ArrayBuffer,
    Uint8Array, Blob, Size, PixelData, Tool, project, Layer, ObjectPool, BlendModes,
    FileDownloader, Utils, MathUtils */

(function () {
    "use strict";
    
    paper.install(window);
    

    var config = {
        APP_NAME: window.location.pathname.replace(/\//gi, ""),
        BACKGROUND_COLOR: "#111111",
        CANVAS_BACKGROUND_COLOR:"#FFFFFF",

        CANVAS_WIDTH: 640,
        CANVAS_HEIGHT: 640, //16:9 aspect ratio
        SCALE_CANVAS: false,
        //TEMPLATE: "../_templates/mesh_head_color.png",
        TEMPLATE: "../_templates/mass_2016-04-23-21-11-26-405.png",
        ANIMATE: false,
        TRACK_MOUSE:false,
        ALLOW_TEMPLATE_SKEW: false,
        CELL_WIDTH:40,
        CELL_HEIGHT:40,
        PADDING:-20,
        BLENDMODE:"multiply",
        OMIT_COLOR:"#000000",
        DRAW_INNER_CIRCLE:false
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
        
        var grid = new Grid(bounds, config.CELL_WIDTH, config.CELL_HEIGHT, config.PADDING);

        grid.addRenderer(renderCircle);
        grid.render();


        if(config.ANIMATE) {
            view.onFrame = onFrame;
        }
    };

    var renderCircle = function(r, cellWidth, cellHeight, padding) {
        var radius = (Math.random() * (r.width / 2) - 5) + 5;

        if(radius < 5) {
            return;
        }

        var col = pixelData.getHex(r.center);
        if(config.OMIT_COLOR && col == config.OMIT_COLOR) {
            return;
        }

        var c = new Path.Circle(r.center, radius);
        c.fillColor = col;
        c.blendMode = config.BLENDMODE;

        if(config.DRAW_INNER_CIRCLE) {
            var c2 = new Path.Circle(r.center, 4);
            c2.fillColor = "white";
            //c2.blendMode = config.BLENDMODE;
        }
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

        var pdl = new PixelDataLoader(config.CANVAS_WIDTH, config.CANVAS_HEIGHT);

        pdl.load(config.TEMPLATE,
            function(pd) {
                pixelData = pd;
                main();
            }
        );
    };

}());