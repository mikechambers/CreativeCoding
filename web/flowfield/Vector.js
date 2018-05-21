import {random} from "./math.js"

export default class Vector {
	constructor(x = 0, y = 0){
		this._x = x;
		this._y = y;
	}

	get x() {
		return this._x;
	}

	set x(x) {
		this._x = x;
	}

	get y() {
		return this._y;
	}

	set y(y) {
		this._y = y;
	}

	get magnitude() {
		return Math.sqrt(this._x * this._x + this._y * this._y);
	}

	set magnitude(magnitude) {
		this.normalize();
		this.multiply(magnitude);
	}

	//todo: should this be a get function or property?
	get heading() {
		return Math.atan2(this._y, this._x);
	}

	normalize(){
		let m = this.magnitude;

		if(m > 0) {
			this.divide(m);
		}
	}

	limit(max) {
		if(this.magnitude > max) {
			this.normalize();
			this.multiply(max);
		}
	}

	add(vector){
		this._x += vector.x;
		this._y += vector.y;
	}

	subtract(vector) {
		this._x -= vector.x;
		this._y -= vector.y;
	}

	multiply(value) {
		this._x *= value;
		this._y *= value;
	}

	divide(value) {
		this._x /= value;
		this._y /= value;
	}

	clone() {
		return new Vector(this._x, this._y);
	}

	static fromAngle(angleInRads = 0) {
		let v = new Vector();
		v.x = Math.cos(angleInRads);
		v.y = Math.sin(angleInRads);

		return v;
	}

	static withRandomVelocity(max = 1) {
		return new Vector(random(-max, max), random(-max, max));
	}
}