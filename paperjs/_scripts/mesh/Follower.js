/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global atob, btoa, ArrayBuffer, Uint8Array, Blob */

class Follower extends Mover {

	//var target = null;
	//var attractionCoefficient = 0.1;

	constructor (target) {
		super();
		this.target = target;
		this.attractionCoefficient = 0.1;
	}

	set target(value) {
		this._target = value;
	}

	get target() {
		return this._target;
	}

	update(tPoint) {
    	if(!tPoint) {
    		tPoint = this.target.location;
    	}

    	//todo
    	this.velocity = this.velocity.normalize(this.limit);

    	var dir = tPoint.subtract(this.location);

    	dir = dir.normalize();

    	//+=
    	dir = dir.multiply(this.attractionCoefficient);

	    this.acceleration = this.acceleration.add(dir);
	    this.velocity = this.velocity.add(this.acceleration);
	    this.location = this.location.add(this.velocity);
	    
	    this.updateAngle();
	    this.acceleration.set(0,0);
    }
}
