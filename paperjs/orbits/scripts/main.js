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
        ANIMATE: false,
        RECORD_CANVAS:false,
        TRACK_MOUSE:false,
        ALLOW_TEMPLATE_SKEW: false,
        HIDPI:false
    };
    
    /*********** Override Config defaults here ******************/
    
    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;

    config.RADIUS_SPACING = 10;
    config.CIRCLE_COUNT = 40;
    config.ANIMATE = true;
    config.RADIUS_COLOR = "white";
    //config.CANVAS_BACKGROUND_COLOR = "pink";
    config.POINT_SIZE = 60;

    config.POINT_COLOR = config.CANVAS_BACKGROUND_COLOR;
    config.POINT_STROKE_COLOR = "white";

    config.RECORD_CANVAS = true;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference
    var bounds;
    let mousePos;

    let circles = [];
    let center;

    var main = function(){

        center = bounds.center;
        
        let c1 = new Path.Circle(center, 2);
            c1.fillColor = "#FFFFFF";

        for(let i = 0; i < config.CIRCLE_COUNT; i++) {

            let radius = (i + 1) * config.RADIUS_SPACING;

            let c = new Path.Circle(center, radius);
            c.strokeColor = config.RADIUS_COLOR;

            let p = Utils.randomPointOnCircle(center, radius);

            let c2 = new Path.Circle(p, config.POINT_SIZE);
            c2.fillColor = config.POINT_COLOR;
            c2.strokeColor = config.POINT_STROKE_COLOR;
            c2.radius = radius;

            c2.direction = (Math.random() > .5)? 1 : -1;
            c2.velocity = Math.random() * 2;

            circles.push(c2);

        }

        if(config.ANIMATE) {
            view.onFrame = onFrame;
        }
    };

    var onFrame = function(event) {
        let len = circles.length;

        for(let i = 0; i < len; i++) {
            let c = circles[i];

            let angle = MathUtils.angleBetweenPoints(center, c.position);

            if(c.direction == 1) {
                c.position = Utils.pointOnCircle(center, c.radius, angle + (MathUtils.PI_2 / 360) * c.velocity);
            } else {
                c.position = Utils.pointOnCircle(center, c.radius, angle - (MathUtils.PI_2 / 360) * c.velocity);
            }
        }

    };

    var onMouseMove = function(event) {
        mousePos = event.point; 
    }

    /*********************** init code ************************/

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

/*
        return canvas;

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
        
        //todo: is this actually setting canvas height / width
        //todo: can we explicitly set the video height / width

        drawCanvas.height = canvasH;
        drawCanvas.width = canvasW;

        //this might be redundant
        //paper.view.viewSize.height = canvasH;
        //paper.view.viewSize.width = canvasW;
        
        return drawCanvas;
*/
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

        if(config.RECORD_CANVAS) {
            fileDownloader.startRecord(drawCanvas);
        }

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
            } else if (event.character === "V") {
                fileDownloader.downloadVideo();
            }
        };

        if(config.TRACK_MOUSE) {
            t.onMouseMove = onMouseMove;
        }

        main();
    };

}());