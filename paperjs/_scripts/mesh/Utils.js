/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global atob, btoa, ArrayBuffer, Uint8Array, Blob, Size, Point */

(function () {
    "use strict";
    
    var Utils = {};
    
    Utils.getRandomSize = function (baseSize) {
        
        //todo: need to do something about this -5
        var s = new Size(baseSize - 5, baseSize);
        s = s.multiply(Size.random().add(0.75)).round();

        return s;
    };
    
    Utils.getRandomRotationInRange = function (range) {
        
        if (!range) {
            return;
        }
        
        var a = range;
        var r = ((Math.random() * a) - a) + (Math.random() * a);
        
        return r;
    };
    
    Utils.getRandomPointInView = function (view, padding) {
        
        var point = new Point(
            Math.floor(Math.random() * view.bounds.width),
            Math.floor(Math.random() * view.bounds.height)
        );
        
        if (padding) {
            if (point.x < padding) {
                point.x = padding;
            } else if (point.x > view.bounds.width - padding) {
                point.x = view.bounds.width - padding;
            }
            
            if (point.y < padding) {
                point.y = padding;
            } else if (point.y > view.bounds.height - padding) {
                point.y = view.bounds.height - padding;
            }
        }
        
        return point;
    };
    
    Utils.getRandomPointInBoundsForRectangle = function (padding, size, view) {
        var point = Utils.getRandomPointInView(view, padding);
        var isValid = false;
        while (!isValid) {

            if ((point.x + size.width + padding < view.bounds.width) &&
                    (point.y + size.height + padding < view.bounds.height)) {
                isValid = true;
            } else {
                point = Utils.getRandomPointInView(view, padding);
            }
        }
        
        return point;
    };

    Utils.constrain = function(amt, low, high) {
        return (amt < low) ? low : ((amt > high) ? high : amt);
    };

    
    window.Utils = Utils;
}());