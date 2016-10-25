/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global atob, btoa, ArrayBuffer, Uint8Array, Blob */

(function () {
    "use strict";


    var Mover = function(bounds) {

        this.location = new Point();
        this.velocity = new Point();
        this.acceleration = new Point();

        this.setBounds(bounds);
    }

    Mover.prototype.bounds; //Size

    Mover.prototype.location; //Point
    Mover.prototype.velocity; //Point
    Mover.prototype.acceleration; //Point

    Mover.prototype.mass = 1.0; //float
    Mover.prototype.angle; //float in degrees
    
    Mover.prototype.minGravityInfluence = 5.0; //float
    Mover.prototype.maxGravityInfluence = 25.0; //float
    Mover.prototype.gravity_coefficient = 0.4; //float
    Mover.prototype.limit = 5.0; //float


    Mover.prototype.applyForce = function(force){
        acceleration += (force / this.mass);
    }

    Mover.prototype.updateAndCheckBounds = function(bounds) {
        this.update();
        return this.checkBounds(bounds);
    }

    Mover.prototype.update = function() {
        //need to impliment limit()
        //http://openframeworks.cc/documentation/math/ofVec3f/#show_limit

        //TODO: this.velocity.limit(this.limit);

/*
        var t = this;
        var limit = function (max) {

            //https://github.com/paperjs/paper.js/blob/develop/src/basic/Point.js
            //https://github.com/processing-js/processing-js/blob/master/src/Objects/PVector.js
            var p = t.velocity;
            if(t.velocity.length > max) {
                var p = p.normalize(max);
                //return p.mult(max);
            }

            return p;
        };

        this.velocity = limit(this.limit);
*/
        //todo: i think this normalizes the vector, but need to test to
        //confirm
        //this.velocity = this.velocity.normalize(this.limit);

        this.velocity = this.velocity.add(this.acceleration);
        this.location = this.location.add(this.velocity);

        //need a Point.set(x, y)
        this.acceleration.set(0, 0);

        this.updateAngle();
    }

    Mover.prototype.updateAngle = function() {

        //in degrees
        this.angle = this.velocity.angle;
        //this.angle = ofRadToDeg(atan2(velocity.y, velocity.x));
    };

    Mover.prototype.repel = function(mover) {
        return (this.attract(mover) *= -1);
    };

    Mover.prototype.attract = function(mover) {

        var force = this.location - mover.location;

        //TODO: need to impliment constrain
        var distance = Utils.constrain(force.length, minGravityInfluence, maxGravityInfluence);

        var force = force.normalize();

        var strength = (this.gravity_coefficient * this.mass * mover.mass) / (distance * distance);

        force = force.multiply(strength);

        return force;
    };

    Mover.prototype.checkBounds = function(bounds) {

        var hitBounds = false;
        var _bounds = (!bounds)?this.bounds:bounds;

        if(this.location.x < _bounds.x || this.location.x > _bounds.width) {
            this.velocity.x *= -1;
            hitBounds = true;
        }
        
        if(this.location.y < _bounds.y || this.location.y > _bounds.height) {
            this.velocity.y *= -1;
            hitBounds = true;
        }

        return hitBounds;
    }

    Mover.prototype.setBounds = function(bounds) {
        this.bounds = bounds;
    }

    //note, this assume max is a positive number
    Mover.prototype.setToRandomVelocity = function(max) {
        if(!max) {
            max = 1.0;
        }

        var min = max * -1;

        this.velocity.set(
            Math.random() * (max - min) + min,
            Math.random() * (max - min) + min
        );
    }
    
    window.Mover = Mover;
}());