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

		//todo: could change defaults to undefined, then if not set, dont make
		//the drawing calls
		//rename to line width?
		this._strokeSize = 1.0;

		//rename to fillStyle? which would all to specify a gradient
		//todo: should default these to be specified as a color and convert when
		//drawing
		this._fillColor = "#000000";

		//rename to strokeStyle?
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

		if(this._strokeSize) {
			ctx.strokeStyle = this._strokeColor;
			ctx.lineWidth = this._strokeSize;
		}

		ctx.fillStyle = this._fillColor;

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
				fill="${this._fillColor}" stroke-width="${this._strokeSize}"/>`;
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

		let canvas = document.createElement('canvas');
		canvas.height = bounds.height;
		canvas.width = bounds.width;

		let ctx = canvas.getContext("2d");

		this.draw(ctx);

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
