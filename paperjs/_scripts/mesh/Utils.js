/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global atob, btoa, ArrayBuffer, Uint8Array, Blob, Size, Point */

class Utils {
    
    static randomSize(baseSize) {
        
        //todo: need to do something about this -5
        var s = new Size(baseSize - 5, baseSize);
        s = s.multiply(Size.random().add(0.75)).round();

        return s;
    };
    
    static randomRotationInRange(range) {
        
        if (!range) {
            return;
        }
        
        var a = range;
        var r = ((Math.random() * a) - a) + (Math.random() * a);
        
        return r;
    };
    
    static randomPointInView(view, padding) {
        return Utils.randomPointInBounds(view.bounds, padding);
    };

    static randomPointInBounds(bounds, padding = 0) {
        
        var point = new Point(
            Math.floor(Math.random() * bounds.width),
            Math.floor(Math.random() * bounds.height)
        );
        
        if (padding) {
            if (point.x < padding) {
                point.x = padding;
            } else if (point.x > bounds.width - padding) {
                point.x = bounds.width - padding;
            }
            
            if (point.y < padding) {
                point.y = padding;
            } else if (point.y > bounds.height - padding) {
                point.y = bounds.height - padding;
            }
        }
        
        return point;
    };
    
    static randomPointInBoundsForRectangle(padding, size, view) {
        var point = Utils.randomPointInView(view, padding);
        var isValid = false;
        while (!isValid) {

            if ((point.x + size.width + padding < view.bounds.width) &&
                    (point.y + size.height + padding < view.bounds.height)) {
                isValid = true;
            } else {
                point = Utils.randomPointInView(view, padding);
            }
        }
        
        return point;
    };

    static pointOnCircle(center, radius, angleInRadians) {
    
        var out = new Point();
        out.x = (Math.cos(angleInRadians) * radius)+ center.x;
        out.y = (Math.sin(angleInRadians) * radius)+ center.y;

        return out;
    }

    static randomPointOnCircle(center, radius) {
        var angleInRadians = (Math.random() * (Math.PI * 2));

        return Utils.pointOnCircle(center, radius, angleInRadians);
    }

    //note, this assumes max is a positive number
    static randomPoint(max = 1.0) {
        return Point.random().multiply(max);
    }

    static randomVector(max = 1.0) {

        var p = Utils.randomPoint(max);

        if(Math.random() > .5){
            p.x *= -1;
        }

        if(Math.random() > .5){
            p.y *= -1;
        }

        return p;
    }

    static constrain(amt, low, high) {
        return (amt < low) ? low : ((amt > high) ? high : amt);
    };

    //Fischer Yates shuffle
    //https://bost.ocks.org/mike/shuffle/
    static shuffle(array) {
        var m = array.length, t, i;

      // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    }

}