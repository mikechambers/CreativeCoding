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
        DRAW_GUIDES:true,
        SEGMENT_LIMIT:40,
        BRUSH_OPACITY:0.5
    };
    
    /*********** Override Config defaults here ******************/
    
    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;
    config.CANVAS_BACKGROUND_COLOR = "#FFFFFF";
    config.BRUSH_OPACITY = 0.9;
    config.SEGMENT_LIMIT = 0;
    config.LINE_LENGTH = 100;
    config.DRAW_GUIDES = false;
    config.BRUSH_COUNT = 25;
    config.BRUSH_SIZE = 4;
    config.POINT_COUNT = 100;

    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference
    var bounds;
   
    let mousePos;

    let centerCircle;
    let mouseCircle;
    let anchorCircle;

    let markerCircles = [];

    const HALF_PI = Math.PI / 2;

    var mover;
    var follower;

    ColorTheme.themes.CM = [
        "#EB3F25",
        "#4DAFD4",
        "#7FA9B3",
        "#83B55B",
        "#E5D34B",
        "#462AA1",
        "#83A5AB",
        "#C1BF51",
        "#9C9C9D",
        "#925661",
        "#F3C047",
        "#874E2A",
        "#CC3959",
        "#67596E",
        "#9FC6D5",
        "#3E67B3",
        "#505D5B",
        "#203840",
        "#7D8D5F",
        "#21325C"
    ];

    let colorIndex = 0;

    let theme = new ColorTheme(ColorTheme.themes.SVENSKAS);

    var main = function(){

        let points;
        for (let i = 0; i < config.POINT_COUNT; i++) {
            points = Utils.randomPointsInBounds(bounds, config.POINT_COUNT, 30);
        }
        mover = new PointFollower(points);
        mover.pathJitter = 0 ;
        mover.attractionCoefficient = 1.0;
        mover.location = Utils.randomPointInBounds(bounds);

        follower = new Follower(mover);
        follower.attractionCoefficient = 0.5;
        follower.location = Utils.randomPointInBounds(bounds);

        if(config.DRAW_GUIDES) {

            for(let i = 0; i < config.POINT_COUNT; i++) {
                let c = new Path.Circle(points[i], 2);
                c.fillColor = "black";
            }

            centerCircle = new Path.Circle(bounds.center, 4);
            centerCircle.fillColor = "black";

            mouseCircle = new Path.Circle(bounds.center, 10);
            mouseCircle.strokeColor = "black";
        }

        if(config.ANIMATE) {
            view.onFrame = onFrame;
        }
    };

    var controlLine;
    var onFrame = function(event) {

        mover.update();
        follower.update();

        if(!markerCircles.length) {
            initMarkers(config.BRUSH_COUNT);
        }

        //this is the anchor for the line we are trying to make
        let anchorPoint = MathUtils.getPointExtendedFromLine(mover.location, follower.location, 50);

        for(let i = 0; i < config.BRUSH_COUNT; i++){
           let a = markerCircles[i];

            a.addSegment( 
                Utils.pointOnCircle(
                    anchorPoint, ((i * (config.LINE_LENGTH / config.BRUSH_COUNT)) + ((config.LINE_LENGTH / config.BRUSH_COUNT) / 2)) - (config.LINE_LENGTH / 2),
                    MathUtils.angleBetweenPoints(follower.location, mover.location) - HALF_PI
                )
            );

            if(config.SEGMENT_LIMIT && (a.segments.length > config.SEGMENT_LIMIT)) {
                a.removeSegment(0);
            }

            a.smooth();
        }

        if(config.DRAW_GUIDES) {

            if(!anchorCircle) {
                anchorCircle = new Path.Circle(anchorPoint, 2);
                anchorCircle.fillColor = "black";
            } else {
                anchorCircle.position = anchorPoint;
            }

            centerCircle.position = follower.location;
            mouseCircle.position = mover.location;

            if(!controlLine) {
                controlLine = new Path.Line({
                    from: follower.location,
                    to: anchorPoint,
                    strokeColor: 'black'
                });
            }

            controlLine.firstSegment.point = mover.location;
            controlLine.lastSegment.point = anchorPoint;
        }
    };

    var initMarkers = function(count){

        for(let i = 0; i < count; i++){
           let aPoint = new Path();
            //aPoint.strokeColor = "white";
            aPoint.strokeColor = theme.getNextColor();
            aPoint.strokeWidth = config.BRUSH_SIZE;
            //aPoint.fillColor = "white";
            aPoint.opacity = config.BRUSH_OPACITY;
            aPoint.strokeCap = "round";
            aPoint.blendMode = "source-over";

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