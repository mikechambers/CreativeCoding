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
        TEMPLATE: null,
        ANIMATE: true,
        ALLOW_TEMPLATE_SKEW: false
    };
    
    /*********** Override Config defaults here ******************/
    
    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference
    var bounds;
    var pixelData;
    let mousePos = new Point();

    let tileCountX = 2;
    let tileCountY = 10;

    //https://github.com/processing-js/processing-js/blob/master/src/P5Functions/Math.js
    var map = function(value, istart, istop, ostart, ostop) {
        return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
    };

    let colorsLeft = [];
    let colorsRight = [];

    var initColors = function() {

        for (let i = 0; i < tileCountY; i++) {
            colorsLeft.push(chroma.random());
            colorsRight.push(chroma.random());
        }
    }

    var main = function(){
        t.onMouseMove = onMouseMove;

        initColors();

        if(config.ANIMATE) {
            view.onFrame = onFrame;
        }
    };

    var onFrame = function(event) {

        project.clear();

        tileCountX = map(mousePos.x, 0, config.CANVAS_WIDTH, 2, 100);
        tileCountY = map(mousePos.y, 0, config.CANVAS_HEIGHT, 2, 10);

        let tileWidth = config.CANVAS_WIDTH / tileCountX;
        let tileHeight = config.CANVAS_HEIGHT / tileCountY;

        let interCol;

        for(let gridY = 0; gridY < tileCountY; gridY++){

            let col1 = colorsLeft[gridY];
            let col2 = colorsRight[gridY];

            var f = chroma.scale([col1, col2]).domain([0, tileCountX]);

            for(let gridX = 0; gridX < tileCountX; gridX++){
                //let amount = map(gridX, 0, tileCountX - 1, 0, 1);

                interCol = f(gridX).hex();

                let posX = tileWidth * gridX;
                let posY = tileHeight * gridY;

                let r = new Path.Rectangle(new Point(posX, posY), new Size(tileWidth, tileHeight));
                r.fillColor = interCol;
                f.strokeColor = interCol;
            }

        }
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

        main();
    };

}());