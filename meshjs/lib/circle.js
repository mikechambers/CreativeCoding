import Vector from "../lib/vector.js"
import Rectangle from "../lib/rectangle.js"


export default class Circle {

	constructor(x, y_r, r) {

		if(x instanceof Vector) {
			this._center = x;
			r = y_r;
		} else {
			this._center = new Vector(x, y_r);
		}

		this._radius = r;

		this._strokeSize = 2;
		this._fillColor = "#FFFFFF";
		this._strokeColor = "#000000";

		this._cachedCanvas = undefined;
		this._shouldCache = false;
	}

	get center(){
		return this._center;
	}

	set center(vector) {
		this._center = vector;
	}

	enableCaching(shouldCache) {
		this._shouldCache = shouldCache;
	}

	set strokeSize(width) {
		this._strokeSize = width;
	}

	set fillColor(c) {
		this._fillColor = c.toRGBA();
	}

	set strokeColor(c) {
		this._strokeColor = c.toRGBA();
	}

	draw(ctx) {

		if(this._cachedCanvas) {
			ctx.drawImage(this._cachedCanvas,
				this._center.x - this._radius,
				this._center.y - this._radius,
				this._cachedCanvas.width, this._cachedCanvas.height);
			return;
		}

		//todo: once it stops growing we could cache the graphic
		ctx.strokeStyle = this._strokeColor;
		ctx.fillStyle = this._fillColor;

		ctx.lineWidth = this._strokeSize;
		ctx.beginPath();
		ctx.arc(this._center.x, this._center.y, this._radius, 0, Math.PI * 2);

		if(this._strokeSize) {
			ctx.stroke();
		}
		ctx.fill();
	}

	toSVG() {
		return `<circle cx="${this._center.x}" cy="${this._center.y}"
				r="${this._radius}" stroke="${this._strokeColor}"
				fill="${this._fillColor}" stroke-width="${this._strokeSize}"/>\n`;
	}

	get bounds() {
		let out = new Rectangle();
		out.x = this._center.x - this._radius;
		out.y = this._center.y - this._radius;
		out.width = this._radius * 2  + this._strokeSize;
		out.height = this._radius * 2 + this._strokeSize;

		return out;
	}

	cache() {

		if(!this._shouldCache) {
				return;
		}

		let bounds = this.bounds;

		let canvas = document.createElement('canvas');
		canvas.height = bounds.height;
		canvas.width = bounds.width;

		let ctx = canvas.getContext("2d");

		ctx.strokeStyle = this._strokeColor;
		ctx.fillStyle = this._fillColor;
		ctx.lineWidth = this._strokeSize;
		ctx.beginPath();
		ctx.arc(bounds.center.x, bounds.center.y, this._radius, 0, Math.PI * 2);
		ctx.stroke();
		ctx.fill();

		this._cachedCanvas = canvas;
	}

	containsPoint(vector) {
		return (this._center.distance(vector) < this._radius);
	}

	set radius(radius){
		this._radius = radius;
	}

	get radius() {
		return this._radius;
	}
}
