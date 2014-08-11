
class BouncingPoint {

	Bounds bounds;
	Point position;
	PVector vector;

	BouncingPoint(Bounds bounds, float velocity) {
		this(bounds, getRandomPointInBounds(bounds), velocity);
	}

	BouncingPoint (Bounds bounds, Point startPoint, float velocity) {
		this.bounds = bounds;
		this.position = startPoint;

		vector = PVector.random2D();
		vector.mult(velocity);
	}

	Point updatePosition() {
		position.x += vector.x;
		position.y += vector.y;

		if(position.x < bounds.x) {
			position.x = bounds.x;
			vector.x *= -1;
		} else if (position.x > bounds.x + bounds.width) {
			position.x = bounds.x + bounds.width;
			vector.x *= -1;
		}

		if(position.y < bounds.y) {
			position.y = bounds.y;
			vector.y *= -1;
		} else if (position.y > bounds.y + bounds.height) {
			position.y = bounds.y + bounds.height;
			vector.y *= -1;
		}

		return position;
	}
}
