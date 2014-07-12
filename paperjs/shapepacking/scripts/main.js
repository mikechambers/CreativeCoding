/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global paper, ColorTheme, Utils, view, Path, FileDownloader, project, Point, Size,
    Layer, Tool, Rectangle, BlendModes */

(function () {
    "use strict";
    
    paper.install(window);
    
    
    var config = {
        APP_NAME: "shapepacking",
        BACKGROUND_COLOR: "#eee",
        RUN_IN_BACKGROUND: true,
        TIMEOUT: 1000,
        BOUNDS_PADDING: 5,
        SHAPE_COUNT: 10,
        BASE_SIZE: 2,
        BLEND_MODE: BlendModes.NORMAL,
        STROKE_WIDTH: 0.5,
        STROKE_COLOR: "#333333",
        ROTATION_RANGE: 0,
        
        CANVAS_WIDTH: 768,
        CANVAS_HEIGHT: 432, //16:9 aspect ratio
        SCALE_CANVAS: false,
        USE_RANDOM_COLORS: true,
        colorTheme: ColorTheme.themes.CROSSWALK
    };
    
    /*********** Override Config defaults here ******************/
    config.SHAPE_COUNT = 50;
    config.STROKE_WIDTH = 2.0;
    config.STROKE_COLOR = "#FFFFFF";
    
    /*************** End Config Override **********************/
    
    var colorTheme = new ColorTheme(config.colorTheme);
    var t; //paperjs tool reference
    
    var backgroundLayer;
    var shapeLayer;
    
    var activeShapes;
    var archivedShapes = [];
    
    var getColor = function () {
        
        var color;
        if (config.USE_RANDOM_COLORS) {
            color = colorTheme.getRandomColor();
        } else {
            color = colorTheme.getNextColor();
        }
        
        return color;
    };
    
    //todo: this can probably move to utils
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
        
        return drawCanvas;
    };
    
    var checkIntersection = function (shape) {

        if (shape.bounds.x + shape.bounds.width > view.bounds.width - config.BOUNDS_PADDING ||
                shape.bounds.x < config.BOUNDS_PADDING ||
                shape.bounds.y < config.BOUNDS_PADDING ||
                shape.bounds.y + shape.bounds.height > view.bounds.height - config.BOUNDS_PADDING) {
            
            return true;
        }
        
        var b;
        var _arr = archivedShapes;
        
        var len = _arr.length;
        
        var s;
        var i;
        for (i = 0; i < len; i++) {
            s = _arr[i];
            
            if (s === shape) {
                continue;
            }
            
            //todo: also check if it is hitting bounds of view
            if (shape.bounds.intersects(s.bounds)) {
                return true;
            }
            
            b = shape.bounds.expand(1);
            b.point = b.point.abs();

            if (b.intersects(s.bounds)) {
                return true;
            }
            
        }
        
        return false;
    };

    var getRandomPointNotInRectangle = function (size) {
        var p = Utils.getRandomPointInBoundsForRectangle(config.BOUNDS_PADDING, size, view);
        
        var len = archivedShapes.length;
        
        var r = new Rectangle(p, size);

        var _t = Date.now();
        var isInShape;
        var shape;
        var i;
        while (true) {
            isInShape = false;
            for (i = 0; i < len; i++) {
                shape = archivedShapes[i];
                if (shape.bounds.intersects(r)) {
                    p = Utils.getRandomPointInBoundsForRectangle(config.BOUNDS_PADDING, size, view);
                    r.x = p.x;
                    r.y = p.y;
                    isInShape = true;
                    break;
                }
            }
                    
            if (!isInShape) {
                return p;
            }
            
            if (config.TIMEOUT && (Date.now() - _t > config.TIMEOUT)) {
                throw new Error("Timeout looking for points");
            }
            
        }
        
        return null;
    };
    
    var generateShapes = function () {
        
        var out = [];
        var i;
        var rect;
        var point;
        var size;
        for (i = 0; i < config.SHAPE_COUNT; i++) {
            
            size = new Size(config.BASE_SIZE, config.BASE_SIZE);
            point = getRandomPointNotInRectangle(size);
            
            rect = new Path.Rectangle({
                point: point,
                size: size,
                fillColor: getColor(),
                strokeColor: config.STROKE_COLOR,
                strokeWidth: config.STROKE_WIDTH,
                blendMode: config.BLEND_MODE,
                rotation: Utils.getRandomRotationInRange(config.ROTATION_RANGE)
            });
            
            out.push(rect);
        }
        
        return out;
    };
    
    var stopAnimation = function () {
        view.onFrame = null;
    };
    
    var fileDownloader;
    window.onload = function () {

        fileDownloader = new FileDownloader(config.APP_NAME);
        var drawCanvas = initCanvas();
        
        drawCanvas.setAttribute("keepalive", config.RUN_IN_BACKGROUND);
        
        
        paper.setup(drawCanvas);
        
        var backgroundLayer = project.activeLayer;

        //programtically set the background colors so we can set it once in a var.
        document.body.style.background = config.BACKGROUND_COLOR;
        drawCanvas.style.background = config.BACKGROUND_COLOR;
        
        var rect = new Path.Rectangle(new Point(0, 0),
                            new Size(view.bounds.width, view.bounds.height)
                );
        
        rect.fillColor = config.BACKGROUND_COLOR;

        shapeLayer = new Layer();
        activeShapes = generateShapes();
        archivedShapes = activeShapes;
        
        view.onFrame = function (event) {

            var len = activeShapes.length;
            
            var isGrowing = false;
            
            var shape;
            var i;
            for (i = 0; i < len; i++) {
                shape = activeShapes[i];
                
                if (checkIntersection(shape)) {
                    continue;
                }
                
                shape.bounds = shape.bounds.expand(1);
                shape.position = shape.position.abs();
                
                /*
                if (checkIntersection(shape)) {
                    shape.bounds = shape.bounds.expand(-1);
                    shape.position = shape.position.abs();
                    continue;
                }
                */
                
                isGrowing = true;
                
            }
            
            if (!isGrowing) {
                activeShapes = generateShapes();
                archivedShapes = archivedShapes.concat(activeShapes);
            }
        };
        
        view.update();

        t = new Tool();

        //Listen for SHIFT-p to save content as SVG file.
        //Listen for SHIFT-o to save as PNG
        t.onKeyUp = function (event) {
            if (event.character === "S") {
                stopAnimation();
                fileDownloader.downloadSVGFromProject(paper.project);
            } else if (event.character === "P") {
                stopAnimation();
                fileDownloader.downloadImageFromCanvas(drawCanvas);
            } else if (event.character === "J") {
                stopAnimation();
                fileDownloader.downloadConfig(config);
            } else if (event.character === "x") {
                stopAnimation();
            }
        };

    };
}());