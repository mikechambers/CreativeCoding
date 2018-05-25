import Circle from "../lib/circle.js"

export default class PCircle extends Circle {
	constructor(x, y_r, r) {
		super(x, y_r, r);

		this._hasCollided = false;
		this._boundsPadding  = 0;
	}

	set shouldGrow(b) {
		this._hasCollided = !b;
	}

	set boundsPadding(padding) {
		this._boundsPadding = padding;
	}

	grow() {
		if(this._hasCollided) {
			return;
		}

		this._radius++;
	}

	checkCollisions(bounds, circles) {

		if(this._hasCollided) {
			return;
		}

		//todo: need to account for stroke size
		if(this._center.x + this._radius >= bounds.width ||
			this._center.x - this._radius <= bounds.x ||
			this._center.y + this._radius >= bounds.height ||
			this._center.y - this._radius <= bounds.y) {

			this.cache();
			this._hasCollided = true;
			return;
		}

		for(let c of circles) {
			if(c === this) {
				continue;
			}

			if(c.radius + this._radius >= c.center.distance(this._center) +
				this._boundsPadding - this._strokeSize) {
				this.cache();
				this._hasCollided = true;
				return;
			}
		}
	}
}
