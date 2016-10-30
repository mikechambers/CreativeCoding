/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global console */
/*
	The MIT License

	Copyright (c) 2011 Mike Chambers

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

class PixelData
    //simple class that exposes an api to make it easy to get
    //data about individual pixels in an ImageData instance
    constructor(imageData) {
        this.imageData = imageData;
    }

    static initFromImage(src, w, h, scale, callback) {
        
        if (!src) {
            throw new Error("PixelData.initFrameImage src not specified.");
        }
        
        var templateImage = new Image();
        templateImage.onload = function () {

            var canvas = document.createElement("canvas");
            canvas.id = "templateCanvas";
            canvas.width = w;
            canvas.height = h;
            
            var context = canvas.getContext("2d");
            context.fillStyle = "#000000";
            context.fillRect(0, 0, w, h);

            if (scale) {
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
            var pixelData = new PixelData();
            pixelData.imageData = imageData;

            callback(pixelData);
        };

        templateImage.src = src;
    };
    
    

    getHex(point) {

        var o = this.getRBGA(point);

        return PixelData.rgbToHex(o.r, o.g, o.b);
    };

    //returns an object with r,g,b,a properties with values
    //with color information about the pixel as the specified coordinate.
    getRBGA(point) {
        var xPos = Math.floor(point.x);
        var yPos = Math.floor(point.y);

        if (point.x < 0 || point.x > this.imageData.width || point.y < 0 || point.y > this.imageData.height) {
            console.log("point out of range", point);
        }

        //copy imageData to a local variable to speed up access
        var imageData = this.imageData;

        if (!imageData) {
            console.log("PixelData.getRBGA() : imageData has not been set.");
            //return {r: 0, g: 0, b: 0, a: 0};
        }

        //figure out the starting offset for the specified pixel
        var offset = (yPos * (imageData.width * 4)) + (xPos * 4);

        //red:0, green:1, blue:2, alhpa:3

        //copy the data into an object
        var out = {
            r: imageData.data[(offset)],
            g: imageData.data[(offset + 1)],
            b: imageData.data[(offset + 2)],
            a: imageData.data[(offset + 3)]
        };

        return out;
    };

    static _helper(c) {
        var hex = c.toString(16);
        
        return hex.length === 1 ? "0" + hex : hex;
    };

    //http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    static rgbToHex(r, g, b) {
        var helper = PixelData._helper;

        return "#" + helper(r) + helper(g) + helper(b);
    };

}
