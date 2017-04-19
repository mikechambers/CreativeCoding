/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global Point */

class MathUtils {

    static distanceBetweenPoints(p1, p2) {
        var _x = p2.x - p1.x;
        var _y = p2.y - p1.y;
        
        return Math.sqrt(_x * _x + _y * _y);
    };
    
    static angleBetweenPoints(p1, p2) {
        //http://stackoverflow.com/questions/9614109/how-to-calculate-an-angle-from-points
        //get the angle of the line
        var dy = p2.y - p1.y;
        var dx = p2.x - p1.x;
        var angle = Math.atan2(dy, dx);
        
        return angle;
    };
    
    /* returns the intersection point on circle1 of a line that goes from the center point of circle1
        to the center point of circle 2 */
    static pointOnCircleAlongLine(centerPoint1, radius1, centerPoint2) {
        
        var p1 = centerPoint1;
        var p2 = centerPoint2;
        var radius = radius1;

        var angle = MathUtils.getLineAngle(p1, p2);
        
        //figure out the point on the circle, based on the angle.
        //this returns the point, relative to (0,0)
        var p3 = new Point();
        p3.x = Math.cos(angle) * radius;
        p3.y = Math.sin(angle) * radius;
        
        //need to shift for the center of the circle
        p3.x = p3.x + p1.x;
        p3.y = p3.y + p1.y;
        
        return p3;
    };

}