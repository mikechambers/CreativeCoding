/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global paper, ColorTheme, Utils, view, Path, FileDownloader, project, Point, Size,
    Layer, Tool, Rectangle, BlendModes, PixelData, console */

(function () {
    "use strict";
    
    paper.install(window);
    
    var startTime = Date.now();
    
    //todo: first time 
    
    var config = {
        APP_NAME: "shapepacking",
        BACKGROUND_COLOR: "#eee",
        RUN_IN_BACKGROUND: true,
        SAVE_PNG_ON_TIMEOUT: false,
        SAVE_SVG_ON_TIMEOUT: false,
        SAVE_CONFIG_ON_TIMEOUT: false,
        TIMEOUT: 200,
        BOUNDS_PADDING: 0,
        SHAPE_COUNT: 10,
        BASE_SIZE: 2,
        BLEND_MODE: BlendModes.NORMAL,
        STROKE_WIDTH: 0.5,
        STROKE_COLOR: "#333333",
        ROTATION_RANGE: 0,
        CONFIG_TEMPLATE: null,
        
        MAX_WIDTH: 0,
        
        CANVAS_WIDTH: 768,
        CANVAS_HEIGHT: 432, //16:9 aspect ratio
        SCALE_CANVAS: false,
        USE_RANDOM_COLORS: true,
        colorTheme: ColorTheme.themes.CROSSWALK
    };
    
    /*********** Override Config defaults here ******************/
    
    config.TIMEOUT = 1000 * 60 * 5;
    
    config.RUN_IN_BACKGROUND = true;
    config.SAVE_CONFIG_ON_TIMEOUT = true;
    config.SAVE_PNG_ON_TIMEOUT = true;
    config.SAVE_SVG_ON_TIMEOUT = true;
    
    config.MAX_WIDTH = 15;
    config.SHAPE_COUNT = 50;
    config.STROKE_WIDTH = 0.5;
    config.BASE_SIZE = 2;
    config.STROKE_COLOR = "#ffffff";
    
    config.CANVAS_WIDTH = 400;
    config.CANVAS_HEIGHT = 400;
    
    config.TEMPLATE = "../_templates/wood_400_400.png";
    
    config.BACKGROUND_COLOR = "#FFFFFF";
    
    /*************** End Config Override **********************/
    
    var colorTheme = new ColorTheme(config.colorTheme);
    var t; //paperjs tool reference
    var fileDownloader;
    
    var shapeCount = config.SHAPE_COUNT;
    
    var backgroundLayer;
    var shapeLayer;
    
    var activeShapes;
    var archivedShapes = [];
    var pixelData;
    
    var canvasPoints;
    var progressDiv;
    var generation = 0;
    
    var getColor = function (point) {
                
        if (config.TEMPLATE) {
            return pixelData.getHex(point);
        }
        
        if (!config.colorTheme) {
            return null;
        }
        
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
        
        var bounds = shape.bounds;
        var viewBounds = view.bounds;
        if (bounds.x + bounds.width > viewBounds.width - config.BOUNDS_PADDING ||
                bounds.x < config.BOUNDS_PADDING ||
                bounds.y < config.BOUNDS_PADDING ||
                bounds.y + bounds.height > viewBounds.height - config.BOUNDS_PADDING) {
            
            return true;
        }
        
        var b;
        var _arr = archivedShapes;
        
        var len = _arr.length;

        var sBounds;
        var s;
        var i;
        for (i = 0; i < len; i++) {
            s = _arr[i];
            
            if (s === shape) {
                continue;
            }
            
            sBounds = s.bounds;
            if (bounds.intersects(sBounds)) {
                return true;
            }
            
            b = bounds.expand(1);
            //b.point = b.point.abs();

            if (b.intersects(sBounds)) {
                return true;
            }
            
            if (config.MAX_WIDTH && (bounds.width > config.MAX_WIDTH)) {
                return true;
            }
        }
        
        return false;
    };

    var updateProgress = function () {
        if (!progressDiv) {
            progressDiv = document.getElementById("progress");
        }
        
        progressDiv.innerHTML = "Points Remaining : " + canvasPoints.length +
            "<br />Total Shapes : " + archivedShapes.length +
            "<br />Generation : " + generation;
        
    };
    
    var removeRandomCanvasPoint = function () {
        var len = canvasPoints.length;
        
        if (!len) {
            throw new Error("No Canvas Points Left");
        }
        
        var o = canvasPoints.splice(Math.floor(Math.random() * len), 1);
        
        updateProgress();
        return o[0];
    };
    
    var getRandomPointNotInRectangle = function (size) {
        //var p = Utils.getRandomPointInBoundsForRectangle(config.BOUNDS_PADDING, size, view);
        var p = removeRandomCanvasPoint();
        
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
                    p = removeRandomCanvasPoint();
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
    
    var initCanvasPoints = function () {
        var out = [];
        
        var w = view.bounds.width;
        var h = view.bounds.height;
        
        var padding = config.BOUNDS_PADDING;
        
        var i;
        var k;
        
        var p;
        for (i = padding; i < h - padding; i++) {
            for (k = padding; k < w - padding; k++) {
                p = new Point(k, i);
                out.push(p);
            }
        }

        return out;
    };
    
    var getSize = function () {
        
        return new Size(1, 1);
        //return new Size(config.BOUNDS_PADDING, config.BOUNDS_PADDING);
    };
    
    var generateShapes = function () {
        
        generation++;
        
        if (generation > 200) {
            shapeCount = 5;
        }
        
        var out = [];
        var i;
        var rect;
        var point;
        var size;
        for (i = 0; i < shapeCount; i++) {
            
            size = getSize();
            point = getRandomPointNotInRectangle(size);

            rect = new Path.Rectangle({
                point: point,
                size: size,
                fillColor: getColor(point),
                strokeColor: config.STROKE_COLOR,
                strokeWidth: config.STROKE_WIDTH,
                blendMode: config.BLEND_MODE,
                rotation: Utils.getRandomRotationInRange(config.ROTATION_RANGE)
            });

            out.push(rect);
        }
        
        return out;
    };
    
    var getRunningTime = function () {
        return (Date.now() - startTime);
    };
    
    var saveJSON = function () {
        var t = getRunningTime();
        config.renderTime = t;
        
        fileDownloader.downloadConfig(config);
    };
    
    var stopAnimation = function () {
        console.log("Animation stopped : " + new Date() + " : " + getRunningTime() + " ms");
        view.onFrame = null;
    };
    
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

        
        var _f = function (pd) {
            
            pixelData = pd;
            canvasPoints = initCanvasPoints();
            
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
                    //shape.position = shape.position.abs();

                    isGrowing = true;

                }

                if (!isGrowing) {
                    try {
                        activeShapes = generateShapes();
                    } catch (e) {
                        console.log(e.message);
                        stopAnimation();


                        if (config.SAVE_PNG_ON_TIMEOUT) {
                            console.log("Saving PNG");
                            fileDownloader.downloadImageFromCanvas(drawCanvas);
                        }

                        if (config.SAVE_CONFIG_ON_TIMEOUT) {
                            console.log("Saving Config");
                            saveJSON();
                        }

                        if (config.SAVE_SVG_ON_TIMEOUT) {
                            console.log("Preparing to save SVG");
                            
                            var _to = setTimeout(function () {
                                fileDownloader.downloadSVGFromProject(paper.project);
                                console.log("Complete");
                            }, 2 * 1000);
                        }
                        
                        return;
                    }

                    archivedShapes = archivedShapes.concat(activeShapes);
                }
            };

            view.update();

            t = new Tool();

            //Listen for SHIFT-p to save content as SVG file.
            //Listen for SHIFT-o to save as PNG
            t.onKeyUp = function (event) {
                if (event.character === "S") {
                    saveJSON();
                    fileDownloader.downloadSVGFromProject(paper.project);
                } else if (event.character === "P") {
                    saveJSON();
                    fileDownloader.downloadImageFromCanvas(drawCanvas);
                } else if (event.character === "J") {
                    saveJSON();
                } else if (event.character === "x") {
                    stopAnimation();
                }
            };
            
        };
        
        if (config.TEMPLATE) {
            PixelData.initFromImage(
                config.TEMPLATE,
                drawCanvas.width,
                drawCanvas.height,
                config.ALLOW_TEMPLATE_SKEW,
                _f
            );
        } else {
            _f();
        }
    };
}());