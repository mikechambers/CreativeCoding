/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global atob, btoa, ArrayBuffer, Uint8Array, Blob */

class PointFollower extends Follower {

	//var target = null;
	//var attractionCoefficient = 0.1;

	constructor (points = []) {
		super();
		this.points = points;
		this.attractionCoefficient = 0.1;
		this.pointIndex = 0;
		this.hitRadius = 10;
		this.randomOrder = false;
		this.pathJitter = 5;
		this.currentTarget = null;
		this.loops = 0;
	}


	getCurrentTarget () {
		//return this.points[this.pointIndex];

		if(!this.currentTarget) {
			this.currentTarget = this.points[0];
		}

		return this.currentTarget;
	}

	getNextPoint (){

		var p;
		if(this.randomOrder) {
			var index = Math.floor(Math.random() * this.points.length);
			this.pointIndex = index;
			p = this.points[index];
		} else {
			this.pointIndex++;
			if(this.pointIndex == this.points.length) {

				this.loops++;
				this.pointIndex = 0;
			}

			p = this.points[this.pointIndex];
		}

		if(this.pathJitter) {
			p = Utils.randomPointOnCircle(p, Math.random() * this.pathJitter);
		}

		return p;
	}

	update() {

		if(!this.points.length) {
			return;
		}

		var tPoint = this.getCurrentTarget();

		if(tPoint.getDistance(this.location) < this.hitRadius) {
			tPoint = this.getNextPoint();

			this.currentTarget = tPoint;

			if(this.onPointHit) {
				//this.onPointHit(oldPoint, newPoint);
			}
		}

		super.update(tPoint);
		//can call super right here

    	//todo
    	/*
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
	    */
    }
}
