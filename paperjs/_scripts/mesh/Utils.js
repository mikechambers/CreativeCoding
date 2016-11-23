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

    static randomPointsInBounds(bounds, count, padding = 0) {
        let out = [];

        for(let i = 0; i < count; i++) {
            out.push(Utils.randomPointInBounds(bounds, padding));
        }

        return out;
    };

    //todo: should we have this return a pixel snapped point?
    static randomPointInBounds(bounds, padding = 0) {

        var point = new Point(
            Math.random() * ((bounds.right - padding) - (bounds.left + padding)) + (bounds.left + padding),
            Math.random() * ((bounds.bottom - padding) - (bounds.top + padding)) + (bounds.top + padding)
        );
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
        out.x = (Math.cos(angleInRadians) * radius) + center.x;
        out.y = (Math.sin(angleInRadians) * radius) + center.y;

        return out;
    }

    static randomPointOnCircle(center, radius) {
        var angleInRadians = (Math.random() * (Math.PI * 2));

        return Utils.pointOnCircle(center, radius, angleInRadians);
    }

    static randomPointInCircle(center, radius) {
    
        var t = 2 * Math.PI * Math.random();
        var u = Math.random() + Math.random();
        var r = (u > 1)? 2.0 - u: u;
        r *= radius;
        
        var x = center.x + r * Math.cos(t);
        var y = center.y + r * Math.sin(t);
    
        return new Point(x, y);
    }

    static randomPointsInCircle(center, radius, count) {
        let points = [];
        
        for(let i = 0; i < count; i++) {
            points.push(Utils.randomPointInCircle(center, radius));
        }
        
        return points;
    }

    static circumference(radius) {
        return 2 * Math.PI * radius;
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

    //It is 0 on the line, and +1 on one side, -1 on the other side.
    //http://stackoverflow.com/a/3461533
    static orientationOfPointToLine(v1, v2, p) {
        var position = ((v2.x - v1.x) * (p.y - v1.y) - (v2.y - v1.y) * (p.x - v1.x));
        
        var s = Math.sign(position);

        if(s == Utils.Sign.POSITIVE) {
            return Utils.Orientation.LEFT;
        } else if (s == Utils.Sign.NEGATIVE) {
            return Utils.Orientation.RIGHT;
        }
        
        return Utils.Orientation.CENTER;
    }

    static findLeftMostPointIndex(points) {
        var leftMost = points[0];
        var leftMostIndex = 0;
        
        let len = points.length;

        for(let i = 1; i < len; i++){
            
            var p = points[i];

            if(p.x < leftMost.x) {
                leftMost = p;
                leftMostIndex = i;
            }
        }

        return leftMostIndex;
    }

    static findConvexHull(points) {

        //check points length;
        var leftMost = points[Utils.findLeftMostPointIndex(points)];

        var endPoint;
        var pointsOnHull = [];
        
        var pointOnHull = leftMost;
        
        var len = points.length;

        do {
            pointsOnHull.push(pointOnHull);
            endPoint = points[0];
            
            for(var j = 1; j < len; j++){
                
                if((endPoint == pointOnHull) ||
                   Utils.orientationOfPointToLine(pointOnHull, endPoint, points[j]) == Utils.Orientation.LEFT){
                    endPoint = points[j];
                }
            }

            pointOnHull = endPoint;
            
        } while(!(endPoint == pointsOnHull[0]));
        
        return pointsOnHull;
    }

    //inclusive - exclusive
    static getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    //inclusive - inclusive
    static getRandomInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

//http://en.wikipedia.org/wiki/Centroid#Centroid_of_polygon
    static findCentroidOfPolygon(points) {
        let a = 0.0;
        let len = points.length;
        
        let p0;
        let p1;
        let _x = 0.0;
        let _y = 0.0;
        for(let i = 0; i < len; i++){

            if(i < len - 1) {
                p0 = points[i];
                p1 = points[i + 1];
            } else {
                p0 = points[i];
                p1 = points[0];
            }

            a += ((p0.x * p1.y) - (p1.x * p0.y));
            _x += ((p0.x + p1.x) * ((p0.x * p1.y) - (p1.x * p0.y)));
            _y += ((p0.y + p1.y) * ((p0.x * p1.y) - (p1.x * p0.y)));
        }

        a = a * 0.5;

        _x = _x / (6.0 * a);
        _y = _y / (6.0 * a);

        return new Point(_x, _y);
    }


}

Utils.Sign = {
    POSITIVE:1,
    NEGATIVE:-1,
    ZERO:0
}

Utils.Orientation = {
    LEFT:-1,
    RIGHT:1,
    CENTER:0
}

