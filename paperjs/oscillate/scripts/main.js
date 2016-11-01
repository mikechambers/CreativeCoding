/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global paper, ColorTheme, Point, view, Shape, Path, atob, btoa, ArrayBuffer,
    Uint8Array, Blob, Size, PixelData, Tool, project, Layer, ObjectPool, BlendModes,
    FileDownloader, Utils, MathUtils */

(function () {
    "use strict";
    
    paper.install(window);
    

    var config = {
        APP_NAME: "mesh",
        BACKGROUND_COLOR: "#EEEEEE",
        CANVAS_BACKGROUND_COLOR:"#333333",
        STROKE_COLOR:"#333333",

        CANVAS_WIDTH: 640,
        CANVAS_HEIGHT: 640, //16:9 aspect ratio
        SCALE_CANVAS: false,
        TEMPLATE: null,
        ANIMATE: true,
        ALLOW_TEMPLATE_SKEW: false,
        SVG_PATH:"../../_templates/svg/create_something.svg",
        ATTRACTION_COEFFICIENT: .9,
        POINT_MASS:1,
        POINT_VELOCITY:.0001,
        POINT_VELOCITY_LIMIT:5,
        COLOR_THEME:"CUSTOM",
        BLEND_MODE:BlendModes.SCREEN,
        SELECTED:true
    };
    
    ColorTheme.themes.CUSTOM = ["#EEEEEE"];

    /*********** Override Config defaults here ******************/
    
    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference
    var bounds;

    var svg;
    var colorTheme;

    var onFrame = function(event) {

        config.POINT_VELOCITY_LIMIT = config.POINT_VELOCITY_LIMIT - 0.01;

        if(config.POINT_VELOCITY_LIMIT < 1.8) {
            config.POINT_VELOCITY_LIMIT = 1.8;
        }

        let len = items.length;

        for(var i = 0; i < len; i++){
            var item = items[i];

            var segment = item.segment;
            var originMover = item.originMover;
            var follower = item.follower;
            follower.limit = config.POINT_VELOCITY_LIMIT;

            var force = originMover.repel(follower);
            follower.applyForce(force);
            follower.update();

            segment.point = follower.location;

            //item.circle.position = follower.location;
        }
    }

    var items = [];
    var onSvgLoad = function(_svg) {
        svg = _svg;
        svg.strokeColor = config.STROKE_COLOR;
        svg.fillColor = config.STROKE_COLOR;

        svg.children[0].clipMask = false;
        svg.children[0].remove();

        svg.selected = config.SELECTED;

        svg.position = bounds.center;
        
        svg.clipMask = false;

        var paths = svg.children.create.children;
        let pLen = paths.length;

        for(let k = 0; k < pLen; k++) {

            paths[k].fillColor = colorTheme.getNextColor();
            paths[k].blendMode = config.BLEND_MODE;

            var segments;
            if(paths[k] instanceof Path) {
                segments = paths[k].segments;
            } else if(paths[k] instanceof CompoundPath) {

                //console.log("CompoundPath");

                segments = [];

                var sLen = paths[k].children.length;

                for(let j = 0; j < sLen; j++){
                    segments = segments.concat(paths[k].children[j].segments);
                }

            }

            var len = segments.length;
            for(let i = 0; i < len; i++) {
                
                var segment = segments[i];

                //var c = new Path.Circle(segment.point, 2);
                //c.fillColor = "white";

                var originMover = new Mover(bounds);
                originMover.location = segment.point.clone();
                originMover.mass = config.POINT_MASS;

                //todo:should have a subclass that doesnt move.
                var follower = new Follower(originMover);
                follower.location = segment.point;
                follower.velocity = Utils.randomVector(config.POINT_VELOCITY);
                follower.limit = config.POINT_VELOCITY_LIMIT;
                follower.attractionCoefficient = config.ATTRACTION_COEFFICIENT;

                var item = {
                    segment:segment,
                    originMover:originMover,
                    follower:follower
                };

                items.push(item);
            }
        }

        if(config.ANIMATE) {
            view.onFrame = onFrame;
        }

    }

    var main = function(){

        colorTheme = new ColorTheme(ColorTheme.themes[config.COLOR_THEME]);

        var svg = project.importSVG(config.SVG_PATH, {
            "expandShapes": true,
            applyMatrix:true,
            onLoad : function(item, rawSVG) {
                onSvgLoad(item);
            }
        });
    };

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

        bounds = view.bounds;
        main();
    };

}());