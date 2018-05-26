import Vector from "../lib/vector.js"

export default class Particle {
	constructor(bounds, opacity = 1.0) {
		this._position = new Vector();
		this._velocity = new Vector();
		this._acceleration = new Vector();

		this._maxVelocity = 4;

		this._bounds = bounds;

		this._lastPosition = this._position;
		this._opacity = opacity;
	}

	update() {

		this._updateLastPosition();
		this._velocity.add(this._acceleration);

		this._velocity.limit(this._maxVelocity);

		this._position.add(this._velocity);
		this._acceleration.multiply(0);

		this.checkEdges();
	}

	_updateLastPosition() {
		this._lastPosition = this._position.clone();
	}

	applyForce(force) {
		this._acceleration.add(force);
	}

	show(ctx, pixelData) {

		let c = pixelData.getColor(this._position);
		c.alpha = this._opacity;

		ctx.strokeStyle = c.toRGBA();
		ctx.lineWidth = 0.5;
		ctx.beginPath();
		ctx.moveTo(this._lastPosition.x, this._lastPosition.y);
		ctx.lineTo(this._position.x, this._position.y);
		ctx.stroke();
	}

	checkEdges() {
		if(this._position.x >= this._bounds.width) {
			this._position.x = this._bounds.x;
			this._updateLastPosition();
		} else if (this._position.x <= this._bounds.x) {
			this._position.x = this._bounds.width - .1;
			this._updateLastPosition();
		}

		if(this._position.y >= this._bounds.height) {
			this._position.y = this._bounds.y;
			this._updateLastPosition();
		} else if (this._position.y <= this._bounds.y) {
			this._position.y = this._bounds.height - .1;
			this._updateLastPosition();
		}
	}

	set color(color) {
		this._particleColor = color;
	}

	get position() {
		return this._position;
	}

	set position(vector) {
		this._position = vector;
	}

	get velocity() {
		return this._velocity;
	}

	set velocity(vector) {
		this._velocity = vector;
	}

	get acceleration() {
		return this._acceleration;
	}

	set acceleration(vector) {
		this._acceleration = vector;
	}

}
