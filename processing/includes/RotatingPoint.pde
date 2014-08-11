
class RotatingPoint {

	Point centerPoint;
	float radius;
	float angle = 0;

	RotatingPoint(Point centerPoint, float radius) {
		this.centerPoint = centerPoint;
		this.radius = radius;
	}

	Point updatePosition(Point centerPoint) {
		this.centerPoint = centerPoint;

		angle += 2;

		if(angle > 360) {
			angle = 0;
		}

		return getPointOnCircle(centerPoint, radius, radians(angle));
	}
}