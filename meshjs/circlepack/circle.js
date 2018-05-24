import Vector from "../lib/vector.js"
import Rectangle from "../lib/rectangle.js"


export default class Circle {

	constructor(x, y_r, r) {

		if(x instanceof Vector) {
			this._position = x;
			r = y_r;
		} else {
			this._position = new Vector(x, y_r);
		}

		this._radius = r;
		this._hasCollided = false;

		this._strokeSize = 2;
		this._boundsPadding  = 0;
		this._fillColor = "#FFFFFF";
		this._strokeColor = "#000000";

		this._cachedCanvas = undefined;
		this._shouldCache = false;
	}

	enableCaching(shouldCache) {
		this._shouldCache = shouldCache;
	}

	set shouldGrow(b) {
		this._hasCollided = !b;
	}

	set strokeSize(width) {
		this._strokeSize = width;
	}

	set boundsPadding(padding) {
		this._boundsPadding = padding;
	}

	set fillColor(c) {
		this._fillColor = c.toRGBA();
	}

	set strokeColor(c) {
		this._strokeColor = c.toRGBA();
	}

	draw(ctx) {

		if(this._cachedCanvas) {
			ctx.drawImage(this._cachedCanvas, this._position.x - this._radius, this._position.y - this._radius, this._cachedCanvas.width, this._cachedCanvas.height);
			return;
		}

		//todo: once it stops growing we could cache the graphic
		ctx.strokeStyle = this._strokeColor;
		ctx.fillStyle = this._fillColor;
		ctx.lineWidth = this._strokeSize;
		ctx.beginPath();
		ctx.arc(this._position.x, this._position.y, this._radius, 0, Math.PI * 2);
		ctx.stroke();
		ctx.fill();
	}

	toSVG() {
		return `<circle cx="${this._position.x}" cy="${this._position.y}"
				r="${this._radius}" stroke="${this._strokeColor}"
				fill="${this._fillColor}" stroke-width="${this._strokeSize}"/>\n`;
	}

	get bounds() {
		let out = new Rectangle();
		out.x = this._position.x - this._radius;
		out.y = this._position.y - this._radius;
		out.width = this._radius * 2  + this._strokeSize;
		out.height = this._radius * 2 + this._strokeSize;

		return out;
	}

	grow() {
		if(this._hasCollided) {
			return;
		}

		this._radius++;
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

	checkCollisions(bounds, circles) {

		if(this._hasCollided) {
			return;
		}

		//todo: need to account for stroke size
		if(this._position.x + this._radius >= bounds.width ||
			this._position.x - this._radius <= bounds.x ||
			this._position.y + this._radius >= bounds.height ||
			this._position.y - this._radius <= bounds.y) {

			this.cache();
			this._hasCollided = true;
			return;
		}

		for(let c of circles) {
			if(c === this) {
				continue;
			}

			if(c.radius + this._radius >= c.position.distance(this._position) +
				this._boundsPadding - this._strokeSize) {
				this.cache();
				this._hasCollided = true;
				return;
			}
		}
	}

	containsPoint(vector) {
		return (this._center.distance(vector) < this._radius);
	}

	set position(vector) {
		this._position = vector;
	}

	get position() {
		return this._position;
	}

	set radius(radius){
		this._radius = radius;
	}

	get radius() {
		return this._radius;
	}
}
