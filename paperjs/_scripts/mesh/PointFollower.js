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
	}


	getCurrentPoint () {
		return this.points[this.pointIndex];
	}

	getNextPoint (){

		if(this.randomOrder) {
			var index = Math.floor(Math.random() * this.points.length);
			this.pointIndex = index;
			return this.points[index];
		}

		this.pointIndex++;
		if(this.pointIndex == this.points.length) {
			this.pointIndex = 0;
		}

		return this.points[this.pointIndex];
	}

	update() {

		if(!this.points.length) {
			return;
		}

		var tPoint = this.getCurrentPoint();

		if(tPoint.getDistance(this.location) < this.hitRadius) {
			tPoint = this.getNextPoint();

			console.log("hit");

			if(this.onPointHit) {
				//this.onPointHit(oldPoint, newPoint);
			}
		}

		//can call super right here

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
