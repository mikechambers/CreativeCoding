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
        HIDPI:false
    };
    
    /*********** Override Config defaults here ******************/
    
    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;

    config.ANIMATE = true;
    config.RECORD_CANVAS = true;

    config.NODE_COUNT = 30;
    config.INITIAL_RADIUS = 60;
    config.RADIUS_MULTIPLIER = .9;
    config.STROKE_COLOR = "black";
    config.FILL_COLOR = "white";
    config.TRACK_FILL_COLOR = "white";
    config.TRACK_STROKE_COLOR = "white";
    config.TRACK_RADIUS = 0;
    config.VELOCITY = 1.8;
    config.RANGE = MathUtils.PI_2 / 16;
    config.OPACITY = 1.0;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference
    var bounds;
    let mousePos;


    //let c;
    //let direction = -1;
    //let pointPosition;
    //let cp;
    //let originAngle = Math.PI / -2;//(3 * Math.PI) / 2;

    class Node {

        constructor(parentNode, radius, config) {

            this.velocity = config.VELOCITY;
            this.direction = Utils.randomSign();
            this.originAngle = Math.PI / -2;
            this._radius = radius;
            this.range = config.RANGE;

            this.parentNode = parentNode;

            this.c = new Path.Circle(this.centerPoint, radius);
            this.c.strokeColor = config.STROKE_COLOR;
            this.c.fillColor = config.FILL_COLOR;
            this.c.opacity = config.OPACITY;

            let pointPosition = Utils.pointOnCircle(this.centerPoint, 60, this.originAngle);

            this.cp = new Path.Circle(pointPosition, config.TRACK_RADIUS);
            this.cp.fillColor = config.TRACK_FILL_COLOR;
            this.cp.strokeColor = config.TRACK_STROKE_COLOR;
            this.cp.opacity = config.OPACITY;
        }

        get trackPosition() {
            return this.cp.position;
        }

        get centerPoint() {
            //ugly lazy hack
            if(this.parentNode instanceof Point) {
                return this.parentNode;
            } else {
                return this.parentNode.trackPosition;
            }
        }

        get radius() {
            return this._radius;
        }

        update(){

            this.c.position = this.centerPoint;

            let angle = MathUtils.angleBetweenPoints(this.c.position, this.cp.position);

            let angleDistance = Math.abs(this.originAngle - angle);

            if(angleDistance >= this.range) {
                this.direction *= -1;
            }

            let degree = Math.PI / 360;

            this.cp.position = Utils.pointOnCircle(this.c.position, this.radius, (angle - degree * this.direction * this.velocity));
        }
    }

    let nodes = [];
    let spine;
    var main = function(){
        
        //let originPoint = new Point(bounds.width / 2, bounds.height);
        let originPoint = new Point(bounds.width / 2, bounds.height - 100);

        //n = new Node(originPoint, 20);

        //n2 = new Node(n, n.radius * 2);
        //n3 = new Node(n2, n2.radius * 2);
        //n4 = new Node(n3, n3.radius * 2);

        for(let i = 0; i < config.NODE_COUNT; i++) {
            let n;
            if(i == 0) {
                n = new Node(originPoint, config.INITIAL_RADIUS, config);
            } else {
                let parentNode = nodes[i - 1];
                n = new Node(parentNode, parentNode.radius * config.RADIUS_MULTIPLIER, config);
            }

            nodes.push(n);
        }

        updateSpine();

        if(config.ANIMATE) {
            view.onFrame = onFrame;
        }
    };

    let updateSpine = function() {

        if(spine){
            spine.remove();
        }

        for(let i = 0; i < config.NODE_COUNT; i++) {

            if(i == 0){
                spine = new Path(nodes[i].centerPoint);
                spine.strokeColor = "black";
            } else {
                spine.add(nodes[i].centerPoint);
            }
        }

        spine.smooth();
    }

    var onFrame = function(event) {
        nodes.forEach(function(n){n.update()});

        updateSpine();
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