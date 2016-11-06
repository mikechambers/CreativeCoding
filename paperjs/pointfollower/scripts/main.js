/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global paper, ColorTheme, Point, view, Shape, Path, atob, btoa, ArrayBuffer,
    Uint8Array, Blob, Size, PixelData, Tool, project, Layer, ObjectPool, BlendModes,
    FileDownloader, Utils, MathUtils */

(function () {
    "use strict";
    
    paper.install(window);
    

    var config = {
        APP_NAME: "mesh",
        BACKGROUND_COLOR: "#000000",
        CANVAS_BACKGROUND_COLOR:"#FFFFFF",
        STROKE_COLOR: "#FFFFFF",
        PATH_COLOR:"#333333",
        FILL_COLOR:"#EEEEEE",
        POINT_COLOR:"#BBBBBB",
        STROKE_WIDTH:1.0,
        CANVAS_WIDTH: 640,
        CANVAS_HEIGHT: 640, //16:9 aspect ratio
        SCALE_CANVAS: false,
        TEMPLATE: null,
        ANIMATE: false,
        ALLOW_TEMPLATE_SKEW: false,
        USE_RANDOM_POINT_ORDER:false,
        HIT_RADIUS:50,
        PATH_OPACITY:0.5,
        DRAW_POINTS:true,
        POINT_COUNT:7,
        BOUNDS_PADDING:150,
        MAX_PATH_SEGMENTS:0, //0 is for no limit
        ATTRACTION_COEFFICIENT:0.6,
        VELOCITY_LIMIT:5,
        SVG_PATH:null,
        MAX_LOOPS:0 //0 is for no limit
    };
    
    /*********** Override Config defaults here ******************/
    
    //config.SVG_PATH = "../_templates/svg/create.svg";
    config.DRAW_POINTS = true;
    config.HIT_RADIUS = 20;
    config.ATTRACTION_COEFFICIENT = 0.8;
    config.MAX_PATH_SEGMENTS = 0;
    config.PATH_OPACITY = 0.2;
    config.PATH_JITTER = 20;
    config.FILL_COLOR = config.CANVAS_BACKGROUND_COLOR;
    config.STROKE_COLOR = config.CANVAS_BACKGROUND_COLOR;
    config.MAX_LOOPS = 0;
    config.USE_RANDOM_POINT_ORDER = false;
    config.POINT_COUNT = 5;

    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference
    var bounds;
    var path;


    var points = [];
    var pFollower;

    var pointGroup;

    var main2 = function(svg){

        if(config.DRAW_POINTS) {
            pointGroup = new Group();
        }

        if(svg) {
            svg.position = bounds.center;
            svg.strokeColor = config.STROKE_COLOR;
            svg.fillColor = config.FILL_COLOR;
            svg.opacity = 1.0;

            var paths = svg.children.create.children;

            for(let path of paths) {
                points = [];

                var tmpPaths = [];
                if(path instanceof Path) {
                    tmpPaths = [path];
                } else if(path instanceof CompoundPath) {

                    tmpPaths = path.children;
                }

                for(let _path of tmpPaths) {
                    
                    for(let segment of _path.segments) {
                        points.push(segment.point);
                    }

                    if(config.DRAW_POINTS)  {
                        for(let _p of points) {
                            var c = new Path.Circle(_p, 1);
                            c.strokeColor = config.POINT_COLOR;
                        }
                    }

                    createTracer(points);
                }
            }
        } else {
            for(var i = 0; i < config.POINT_COUNT; i++) {
                var p = Utils.randomPointInBounds(bounds, config.BOUNDS_PADDING);

                points.push(p);
            }

            createTracer(points);
        }
    };

    var main = function(){

        if(!config.SVG_PATH) {
            main2();
            return;
        }

        project.importSVG(config.SVG_PATH, {
            "expandShapes": true,
            applyMatrix:true,
            onLoad : function(svg, rawSVG) {
                main2(svg);
            }
        });
    }


    var createTracer = function(points) {
        var pFollower = new PointFollower(points);
        pFollower.location = points[0];
        pFollower.attractionCoefficient = config.ATTRACTION_COEFFICIENT;
        pFollower.limit = config.VELOCITY_LIMIT;
        pFollower.randomOrder = config.USE_RANDOM_POINT_ORDER;
        pFollower.hitRadius = config.HIT_RADIUS;
        pFollower.pathJitter = config.PATH_JITTER;
        //pFollower.limit(100);

        var path = new Path();
        path.strokeColor = config.PATH_COLOR;
        path.strokeWidth = config.STROKE_WIDTH;
        path.opacity = config.PATH_OPACITY;
        path.mover = pFollower;

        path.onFrame = function() {

            this.mover.update();

            path.add(this.mover.location);

            
            if(config.MAX_PATH_SEGMENTS) {
                if(this.mover.segments.length > config.MAX_PATH_SEGMENTS) {
                    path.removeSegment(0);
                }
            }

            if(config.MAX_LOOPS) {
                if (this.mover.loops >= config.MAX_LOOPS){
                    this.onFrame = null;
                }
            }
        }

        if(config.DRAW_POINTS)  {

            for(let _p of points) {
                var c = new Path.Circle(_p, 2);
                c.strokeColor = config.POINT_COLOR;
                pointGroup.addChild(c);
            }
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

        };

        templateImage.src = config.TEMPLATE;
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
        
        var rect = new Path.Rectangle(new Point(0, 0),
                            new Size(view.bounds.width, view.bounds.height)
                );
        
        rect.fillColor = config.CANVAS_BACKGROUND_COLOR;
      
        if(config.TEMPLATE) {
            initTemplate(drawCanvas);
        }

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

        if(config.ANIMATE) {
            view.onFrame = onFrame;
        }

        bounds = view.bounds;
        main();
    };

}());