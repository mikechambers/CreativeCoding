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
        ALLOW_TEMPLATE_SKEW: false,
        LAYER_WIDTH:20,
        LAYER_COUNT:25
    };
    
    /*********** Override Config defaults here ******************/
    
    //config.CANVAS_WIDTH = 1280;
    //config.CANVAS_HEIGHT = 1280;
    
    /*************** End Config Override **********************/
  
    var t; //paperjs tool reference
    var bounds;
    var pixelData;

    var main = function(){

        var center = bounds.center;

        circle(center, 0, config.LAYER_WIDTH);

        var c = config.LAYER_WIDTH;
        do  {
                var g = generators[Math.floor(Math.random() * generators.length)];

                g(center, c, c + config.LAYER_WIDTH);
                c += config.LAYER_WIDTH;
        } while(c < (config.LAYER_COUNT * config.LAYER_WIDTH));
        
        view.onFrame = onFrame;
    };

    var circle = function(center, startRadius, endRadius) {

        var path = new CompoundPath({
            children: [
                new Path.Circle({
                    center: center,
                    radius: endRadius
                }),
                new Path.Circle({
                    center: center,
                    radius: startRadius
                })
            ],
            fillColor: "white",
            strokeColor:"black",
        });

        return path;
    }

    var generators =[
        circle,

        function(center, startRadius, endRadius) {
            var path = new CompoundPath({
                children: [
                    new Path.Circle({
                        center: center,
                        radius: endRadius
                    }),
                    new Path.Circle({
                        center: center,
                        radius: startRadius
                    })
                ],
                fillColor: "black",
                strokeColor:"black",
            });

            return path;
        },

        function(center, startRadius, endRadius) {
            var path = new CompoundPath({
                children: [
                    new Path.Circle({
                        center: center,
                        radius: endRadius
                    }),
                    new Path.Circle({
                        center: center,
                        radius: startRadius
                    })
                ],
                fillColor: "white",
                strokeColor:"black",
            });

            var fillColor = "black";

            if(Math.random() > .5) {
                fillColor = "white";
            }

            var midpoint = (startRadius + endRadius) / 2;
            var radius = 3;
            var spacing = 6;
            var steps = Math.floor(Utils.circumference(midpoint) / (radius + spacing));

            for(let i = 0; i < steps; i++) {

                var a = (Math.PI * 2) / steps;
                var p = Utils.pointOnCircle(center, midpoint, a * i);

                var c = new Path.Circle({
                    center:p,
                    radius:radius,
                    fillColor:fillColor,
                    strokeColor:"black"

                });

                //todo: if added to compound path, fillcolor is ignored
                //path.addChild(c);
            }

            return path;
        },

        function(center, startRadius, endRadius) {
            var path = new CompoundPath({
                children: [
                    new Path.Circle({
                        center: center,
                        radius: endRadius
                    }),
                    new Path.Circle({
                        center: center,
                        radius: startRadius
                    })
                ],
                fillColor: "white",
                strokeColor:"black",
            });

            var fillColor = "black";

            if(Math.random() > .5) {
                fillColor = "white";
            }

            var midpoint = (startRadius + endRadius) / 2;
            var spacing = Math.ceil(Math.random() * 22) + 2;
            var steps = Math.floor(Utils.circumference(midpoint) / (spacing));

            var strokeWidth = Math.ceil(Math.random() * (spacing / 2));
            console.log(strokeWidth);

            for(let i = 0; i < steps; i++) {

                var a = (Math.PI * 2) / steps;
                var p1 = Utils.pointOnCircle(center, startRadius, a * i);
                var p2 = Utils.pointOnCircle(center, endRadius, a * i);

                var c = new Path.Line(p1, p2);
                c.strokeColor = "black";
                c.strokeWidth = strokeWidth;
            }

            return path;
        },

        function(center, startRadius, endRadius) {
            var path = new CompoundPath({
                children: [
                    new Path.Circle({
                        center: center,
                        radius: endRadius
                    }),
                    new Path.Circle({
                        center: center,
                        radius: startRadius
                    })
                ],
                fillColor: "white",
                strokeColor:"black",
            });

            var fillColor = "black";

            if(Math.random() > .5) {
                fillColor = "white";
            }

            var smooth = true;

          if(Math.random() > .5) {
                smooth = !smooth;
            }

            var midpoint = (startRadius + endRadius) / 2;
            var spacing = endRadius - startRadius;
            var steps = Math.floor(Utils.circumference(midpoint) / (spacing));

            var _p;

            for(let i = 0; i < steps * 2; i++) {

                var pRadius = startRadius;

                if(i % 2) {
                    pRadius = endRadius;
                }

                var a = (Math.PI * 2) / steps;
                var point = Utils.pointOnCircle(center, pRadius, a * i);

                if(!_p) {
                     _p = new Path(point);
                     _p.strokeColor = "black";
                     _p.strokeColor = "black";
                     _p.closePath();
                } else {
                    _p.add(point);

                    if(smooth) {
                        _p.smooth({ type: 'catmull-rom', factor: 0.5 });
                    }
                }
                
            }

            return path;
        }
    ];



    var onFrame = function(event) {

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

            main();
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

        if(config.TEMPLATE) {
            initTemplate(drawCanvas);
        } else {
            main();
        }
    };

}());