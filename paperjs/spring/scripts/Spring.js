
class Spring {
	constructor(anchor, length) {
		this.anchor = anchor;
		this.length = length;
		this.k = 0.1;
	}

	connect(bob) {
		let force = bob.location.subtract(this.anchor);

		let d = force.length; //magnitude

		let stretch = d - this.length;

		force = force.normalize();
		force = force.multiply(-1 * this.k * stretch);

		bob.applyForce(force);
	}

	constrainLength(bob, minlen, maxlen) {
		let dir = bob.location.subtract(this.anchor);
		let d = dir.length;

		if(d < minlen) {
			dir = dir.normalize();
			dir = dir.multiply(minlen);

			bob.location = this.anchor.add(dir);

			bob.velocity = bob.velocity.multiply(0);
		} else if (d > maxlen) {
			dir = dir.normalize();
			dir = dir.multiply(maxlen);

			bob.location = this.anchor.add(dir);
			bob.velocity = bob.velocity.multiply(0);
		}
	}

}