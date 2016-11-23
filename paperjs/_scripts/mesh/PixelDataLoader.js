/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global console */
/*
	The MIT License

	Copyright (c) 2016 Mike Chambers

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

class PixelDataLoader {

    constructor(width, height, allowTemplateSkew = true) {
        this.width = width;
        this.height = height;
        this.allowTemplateSkew = allowTemplateSkew;
        this.canvasId = (Math.random() + "" + new Date().getTime());//need to 
    }

    load(src, onload) {
        var templateImage = new Image();

        let _allowTemplateSkew = this.allowTemplateSkew;
        let _w = this.width;
        let _h = this.height;
        let o = this;

        templateImage.onload = function () {
                
            var w = _w
            var h = _h;

            var canvas = document.createElement("canvas");
            canvas.id = this.canvasId;
            canvas.width = w;
            canvas.height = h;
            
            //todo: probably should scale the images depending on canvas size.
            
            var context = canvas.getContext("2d");
            context.fillStyle = "#000000";
            context.fillRect(0, 0, w, h);

            if (_allowTemplateSkew) {
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
            o.pixelData = new PixelData();
            o.pixelData.imageData = imageData;

            if(onload) {
            	onload(o.pixelData);
            }
        };

        templateImage.src = src;
    }

}