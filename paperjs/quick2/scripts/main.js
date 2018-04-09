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
        TRACK_MOUSE:false,
        ALLOW_TEMPLATE_SKEW: false,
        HIDPI:false,
        RECORD_CANVAS: false
    };
    
    /*********** Override Config defaults here ******************/
    
    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;

    config.RECORD_CANVAS = false;
    config.CANVAS_BACKGROUND_COLOR = "yellow";

    config.ANIMATE = true;
    config.RECORD_CANVAS = true;

    config.RADIUS = 3;
    config.STROKE_COLOR = "red";
    config.FILL_COLOR = "red";
    config.POINT_COUNT = 400;
    config.MAX_RANGE = 4.0;
    config.MIN_RANGE = 2.0;
    config.STEP_SIZE = 0.02;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference
    var bounds;
    let mousePos;

    let followers;

    class f extends Follower {
        constructor (target, position, config) {

            super(target);

            this.config = config;

            this.c = new Path.Circle(position, config.RADIUS);
            this.c.strokeColor = config.STROKE_COLOR;
            this.c.fillColor = config.FILL_COLOR;

            //this.velocity = Utils.randomVector(1.0);
            //console.log(this.velocity);

            this.location = position;
            this.attractionCoefficient = config.MIN_RANGE;
            this.aCoefficientDirection = 1;
        }

        update () {
            super.update();

            this.c.position = this.location;

            this.attractionCoefficient += this.config.STEP_SIZE * this.aCoefficientDirection;

            if(this.attractionCoefficient > this.config.MAX_RANGE) {
                this.aCoefficientDirection *= -1;
                this.attractionCoefficient = this.config.MAX_RANGE;
            } else if (this.attractionCoefficient < this.config.MIN_RANGE) {
                this.aCoefficientDirection *= -1;
                this.attractionCoefficient = this.config.MIN_RANGE;
            }
        }
    }

    var main = function(){

        let points = Utils.randomPointsInBounds(bounds, config.POINT_COUNT);

        followers = [];

        for(let i = 0; i < points.length; i++) {
            let target;
            let p = points[i];

            if(i > 0) {
                target = followers[followers.length - 1];
            }

            followers.push(new f(target, p, config));
        }

        followers[0].target = followers[followers.length - 1];

        if(config.ANIMATE) {
            view.onFrame = onFrame;
        }
    };

    var onFrame = function(event) {

        for(let i = 0; i < followers.length; i++){
            followers[i].update();
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
    }

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