import Vector from "../lib/vector.js"
import Rectangle from "../lib/rectangle.js"
import Color from "../lib/color.js"


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
		this._fillColor = Color.WHITE;

		//rename to strokeStyle?
		this._strokeColor = Color.BLACK;

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
		this._fillColor = c;
	}

	set strokeColor(c) {
		this._strokeColor = c;
	}

	draw(ctx) {

		if(!ctx) {
			console.log("Error: Circle.draw : canvas context is undefined.");
		}

		if(this._cachedCanvas) {
			ctx.drawImage(this._cachedCanvas,
				this._center.x - this._radius,
				this._center.y - this._radius,
				this._cachedCanvas.width, this._cachedCanvas.height);
			return;
		}

		if(this._strokeSize) {
			ctx.lineStyle = this._strokeColor.toRGBA();
			ctx.lineWidth = this._strokeSize;
		}

		ctx.fillStyle = this._fillColor.toRGBA();

		ctx.beginPath();
		ctx.arc(this._center.x, this._center.y, this._radius, 0, Math.PI * 2);

		if(this._strokeSize) {
			ctx.stroke();
		}

		ctx.fill();
	}

	toSVG() {

		//note, we dont use rgba for colors, but use hex amd exlpicit opacity
		//in order to maintain support with illustrator
		return `<circle cx="${this._center.x}" cy="${this._center.y}"
				r="${this._radius}" stroke="${this._strokeColor.toHex()}"
				fill-opacity="${this._fillColor.a}"
				stroke-opacity="${this._strokeColor.a}"
				fill="${this._fillColor.toHex()}" stroke-width="${this._strokeSize}"/>`;
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
