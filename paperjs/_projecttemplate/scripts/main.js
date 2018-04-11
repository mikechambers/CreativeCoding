/*
    Copyright 2018 Mike Chambers
    https://github.com/mikechambers/CreativeCoding
    mikechambers@gmail.com

    Released under an MIT License
    https://opensource.org/licenses/MIT
*/

(function () {
    "use strict";
    
    paper.install(window);
    
    /*********** Override Config defaults here ******************/
    var config = {

        //get the app name from the directory name
        APP_NAME: window.location.pathname.replace(/\//gi, ""),

        BACKGROUND_COLOR: "#FFFFFF", //web page color
        CANVAS_BACKGROUND_COLOR:"#111111",

        CANVAS_WIDTH: 640,
        CANVAS_HEIGHT: 640,

        TEMPLATE: null,
        ALLOW_TEMPLATE_SKEW: false,
        CACHE_PIXEL_DATA:false,

        ANIMATE: false,
        TRACK_MOUSE:false, //whether we listen for mouse moe events
        
        //whether we enable Paper.hs hidpi setting
        //this changes canvas size when true (default) and causes issues when capturing video
        HIDPI:false,

        //whether we should record canvas to output as video
        RECORD_CANVAS: false
    };
    
    /*********** Override Config defaults here ******************/
    
    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;
    //config.RECORD_CANVAS = truel
    //config.ANIMATE = true;
    
    /*************** End Config Override **********************/
  
    //PixelData avaliable is config.TEMPLATE is not undefined
    let pixelData;

    let bounds;
    let mousePos;

    //main entry point for code. Called once when page
    //loads
    var main = function(){
        //ADD CODE HERE
    };

    //Called every frame
    //note config.ANIMATE must be set to true in order for this
    //to fire
    var onFrame = function(event) {
        //ADD UPDATE CODE HERE
    };


    /*********************** init code ************************/

    //called if TRACK_MOUSE is set to true
    //note for performance reasons dont update code here. Instread, use
    //the mousePos variable within onFrame above
    var onMouseMove = function(event) {
        mousePos = event.point; 
    }

    //initialize, size and setup canvas
    var initCanvas = function () {

        let container = document.getElementById("canvas_container");
        var canvas = document.createElement('canvas');
        
        canvas.id = "paperjs_canvas";
        canvas.height = config.CANVAS_HEIGHT;
        canvas.width = config.CANVAS_HEIGHT;

        if(!config.HIDPI) {
            canvas.setAttribute("hidpi", "off");
        }
        container.appendChild(canvas);

        return canvas;
    }

    let fileDownloader;
    let t; //paperjs tool reference
    window.onload = function () {

        //initialize filedownloader so we can create
        //and save PNGs, SVGs and videos from our projects
        fileDownloader = new FileDownloader(config.APP_NAME);

        var drawCanvas = initCanvas();
        
        paper.setup(drawCanvas);

        //programtically set the background colors so we can set it once in a var.
        document.body.style.background = config.BACKGROUND_COLOR;
        drawCanvas.style.background = config.CANVAS_BACKGROUND_COLOR;
        
        if(config.RECORD_CANVAS) {
            fileDownloader.startRecord(drawCanvas);
        }

        bounds = view.bounds;

        //draw a rectangle as the background color. This is so
        //correct background color is included when exporting as
        //SVG
        var rect = new Path.Rectangle(bounds);
        rect.fillColor = config.CANVAS_BACKGROUND_COLOR;
    
        t = new Tool();

        //Listen for SHIFT-p to save content as SVG file.
        //Listen for SHIFT-o to save as PNG
        //Listen for SHIFT-v to save as webme / h264 video (60fps)
        //List for SHIFT-j to save JSON of config parameter
        t.onKeyUp = function (event) {
            if (event.character === "S") {
                fileDownloader.downloadSVGFromProject(paper.project);
            } else if (event.character === "P") {
                fileDownloader.downloadImageFromCanvas(drawCanvas);
            } else if (event.character === "J") {
                fileDownloader.downloadConfig(config);
            } else if (event.character === "V") {
                fileDownloader.downloadVideo();
            }
        };

        if(config.TRACK_MOUSE) {
            t.onMouseMove = onMouseMove;
        }

        //function to call main(). Need here as we may need to
        //call from a callback  function below
        let runMain = function() {
            main();
            if(config.ANIMATE) {
                view.onFrame = onFrame;
            }
        }

        if(config.TEMPLATE) {
            //if config.TEMPLATE is set to an image path, we load that image, and capture its pixeldata
            //for access later.
            //make sure PixelData.js and PixelDataLoader.js are loaded in index.html
            var pdl = new PixelDataLoader(config.CANVAS_WIDTH, config.CANVAS_HEIGHT, config.ALLOW_TEMPLATE_SKEW);

            pdl.load(config.TEMPLATE,
                function(pd) {
                    pixelData = pd;
                    runMain();
                },
                config.CACHE_PIXEL_DATA
            );
        } else {
            runMain();
        }
    };

}());