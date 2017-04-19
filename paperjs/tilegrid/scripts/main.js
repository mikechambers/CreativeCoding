/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global paper, ColorTheme, Point, view, Shape, Path, atob, btoa, ArrayBuffer,
    Uint8Array, Blob, Size, PixelData, Tool, project, Layer, ObjectPool, BlendModes, FileDownloader, Utils */

(function () {
    "use strict";
    
    paper.install(window);
    
    
    var config = {
        APP_NAME: "tilegrid",
        BACKGROUND_COLOR: "#eee",
        
        BOUNDS_PADDING: 0,

        TILE_COUNT: 500,
        
        BASE_SIZE: 12,//3, 6,12,24,48 work well with no padding
        CORNER_RADIUS: 0,
        
        BLEND_MODE: BlendModes.NORMAL,
        STROKE_WIDTH: 0.5,
        STROKE_COLOR: "#333333",
        ROTATION_RANGE: 0,
        COLOR_RECTANGLE: true,
        FILL_OPACITY: 1.0,
        RANDOM_SIZE_MODIFIER: 1, //no change
        
        CANVAS_WIDTH: 768,
        CANVAS_HEIGHT: 432, //16:9 aspect ratio
        SCALE_CANVAS: false,
        USE_RANDOM_COLORS: true,
        colorTheme: ColorTheme.themes.TOKYO_TRACK,
        RANDOM_SIZE: false,
        RANDOM_POSITION: false,
        USE_MOUSE: false,
        TEMPLATE: null
    };
    
    /*********** Override Config defaults here ******************/
    
    //config.BACKGROUND_COLOR = "#eee";
    
    
    config.BOUNDS_PADDING = 2;
    config.BASE_SIZE = 12;
    //config.ROTATION_RANGE = 90;
    config.CORNER_RADIUS = 3;
    config.STROKE_COLOR = null;
    config.FILL_OPACITY = "1.0";
    //config.TILE_COUNT = 15000;
    //config.BLEND_MODE = BlendModes.HARD_LIGHT;
    
    //config.RANDOM_SIZE_MODIFIER = 10;
    config.RANDOM_POSITION = false;
    //config.RANDOM_SIZE = true;
    
    //config.USE_MOUSE = true;
    
    config.TEMPLATE = "../_templates/saltponds.png";
    
    /*************** End Config Override **********************/
    
    var colorTheme = new ColorTheme(config.colorTheme);
    var t; //paperjs tool reference
    var tiles;
    var pixelData;
    
    var backgroundLayer;
    var tileLayer;
    
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
    
    var getFillColor = function (point) {
        if (!config.COLOR_RECTANGLE) {
            return;
        }
        
        return getColor(point);
    };
    
    var getStrokeColor = function (point) {
        if (config.STROKE_COLOR) {
            return config.STROKE_COLOR;
        }
        
        return getColor(point);
    };
    
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
    
    var _s;
    var getSize = function () {
        
        if (!config.RANDOM_SIZE && !_s) {
            _s = new Size(config.BASE_SIZE, config.BASE_SIZE);
        }
        
        var s;
        if (!config.RANDOM_SIZE) {
            s = _s;
        } else {
            s = new Size(config.BASE_SIZE - 5, config.BASE_SIZE);
            var modifier = 1;
            
            if (config.RANDOM_SIZE_MODIFIER > 1) {
                modifier = Math.random() * config.RANDOM_SIZE_MODIFIER;
            }
            
            s = s.multiply(Size.random().add(0.75).multiply(modifier)).round();
        }
        return s;
    };
    
    var createRectangle = function (point, size) {
        var rect = new Path.Rectangle({
            point: point,
            size: size,
            fillColor: getFillColor(point),
            strokeColor: getStrokeColor(point),
            strokeWidth: config.STROKE_WIDTH,
            blendMode: config.BLEND_MODE,
            radius: config.CORNER_RADIUS,
            opacity: config.FILL_OPACITY
        });

        if (config.ROTATION_RANGE) {
            rect.rotation = Utils.getRandomRotationInRange(config.ROTATION_RANGE);
        }
        
        return rect;
    };
    
    var generateRandomTiles = function () {
        
        var out = [];
        var i;
        var rect;
        var point;
        var size;
        for (i = 0; i < config.TILE_COUNT; i++) {
            
            size = getSize();
            point = Utils.getRandomPointInBoundsForRectangle(config.BOUNDS_PADDING, size, view);
            
            rect = createRectangle(point, size);
            
            out.push(rect);
        }
        
        return out;
    };
    
    var generateTiles = function () {
        
        var out = [];
        var i;
        var rect;
        var point;
        var size;
        
        var row = 0;
        var column = 0;
        var _x;
        var _y;
        
        size = getSize();
        
        var shouldContinue = true;
        while (shouldContinue) {
            
            _x = (column * size.width) + (config.BOUNDS_PADDING * (column + 1));
            
            if (_x + size.width > view.bounds.width) {
                column = 0;
                row++;
            }
            
            _x = (column * size.width) + (config.BOUNDS_PADDING * (column + 1));
            
            _y = row * size.height + (config.BOUNDS_PADDING * (row + 1));
            if (_y + size.height > view.bounds.height) {
                
                shouldContinue = false;
                break;
            }
            
            point = new Point(
                _x,
                _y
            );
            
            rect = createRectangle(point, size);
            
            out.push(out);
            
            column++;
            
        }
        return out;
    };
    
    var initTemplate = function (w, h, callback) {
        
        if (!config.TEMPLATE) {
            callback(false);
            return;
        }
        
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
            pixelData = new PixelData(imageData);

            callback(true);
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
        drawCanvas.style.background = config.BACKGROUND_COLOR;

        var rect = new Path.Rectangle(new Point(0, 0),
                            new Size(view.bounds.width, view.bounds.height)
                );

        rect.fillColor = config.BACKGROUND_COLOR;


        initTemplate(drawCanvas.width, drawCanvas.height,
            function () {
                
                t = new Tool();
                
                tileLayer = new Layer();
                
                if (config.RANDOM_POSITION) {
                    generateRandomTiles();
                }
                
                if (!config.USE_MOUSE) {
                    tiles = generateTiles();
                } else {
                    t.minDistance = 10;
                
                    t.onMouseDrag = function (event) {
                        
                        var rect = createRectangle(event.point, getSize());
                        view.update();
                    };
                }
                
                view.update();
                
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
            }
            );
        
    };
    
    
}());