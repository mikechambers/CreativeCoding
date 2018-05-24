import Vector from "../lib/vector.js"


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

	grow() {
		if(this._hasCollided) {
			return;
		}

		this._radius++;
	}

	checkCollisions(bounds, circles) {
		if(this._position.x + this._radius >= bounds.width ||
			this._position.x - this._radius <= bounds.x ||
			this._position.y + this._radius >= bounds.height ||
			this._position.y - this._radius <= bounds.y) {

			this._hasCollided = true;
			return;
		}

		for(let c of circles) {
			if(c === this) {
				continue;
			}

			if(c.radius + this._radius >= c.position.distance(this._position) +
				this._boundsPadding - this._strokeSize) {
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
