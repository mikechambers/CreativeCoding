/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global atob, btoa, ArrayBuffer, Uint8Array, Blob */

class Mover {

    //bounds; //Rectangle
    //location; //Point
    //velocity; //Point
    //acceleration; //Point

    //mass = 1.0; //float
    //angle; //float in degrees
    
    //minGravityInfluence = 5.0; //float
    //maxGravityInfluence = 25.0; //float
    //gravityCoefficient = 0.4; //float
    //limit = 5.0; //float

    constructor(bounds) {

        this.location = new Point();
        this.velocity = new Point();
        this.acceleration = new Point();

        this.mass = 1.0; //float
        this.angle = 0.0; //float in degrees
    
        this.minGravityInfluence = 5.0; //float
        this.maxGravityInfluence = 25.0; //float
        this.gravityCoefficient = 0.4; //float
        this.limit = 5.0; //float

        this.setBounds(bounds);
    }

    applyForce(...forces){

        //todo: need to check performance of this
        for (let force of forces) {
            this.acceleration = this.acceleration.add(force.divide(this.mass));
        }
    }

    updateAndCheckBounds(bounds) {
        this.update();
        return this.checkBounds(bounds);
    }

    update() {
        //todo: i think this normalizes the vector, but need to test to
        //confirm
        this.velocity = this.velocity.normalize(this.limit);

        this.velocity = this.velocity.add(this.acceleration);
        this.location = this.location.add(this.velocity);

        //need a Point.set(x, y)
        this.acceleration.set(0, 0);

        this.updateAngle();
    }

    updateAngle() {

        //in degrees
        this.angle = this.velocity.angle;
        //this.angle = ofRadToDeg(atan2(velocity.y, velocity.x));
    };

    repel(mover) {
        return this.attract(mover).multiply(-1);
    };

    attract(mover) {

        var force = this.location.subtract(mover.location);

        var distance = Utils.constrain(force.length, this.minGravityInfluence, this.maxGravityInfluence);

        force = force.normalize();

        //formula for gravity
        var strength = (this.gravityCoefficient * this.mass * mover.mass) / (distance * distance);

        force = force.multiply(strength);

        return force;
    };

    checkBounds(bounds = this.bounds) {

        var hitBounds = false;
        //var _bounds = (!bounds)?this.bounds:bounds;

        if(this.location.x < bounds.x || this.location.x > bounds.right) {
            this.velocity.x *= -1;
            hitBounds = true;
        }
        
        if(this.location.y < bounds.y || this.location.y > bounds.bottom) {
            this.velocity.y *= -1;
            hitBounds = true;
        }

        return hitBounds;
    }

    setBounds(bounds) {
        this.bounds = bounds;
    }
}