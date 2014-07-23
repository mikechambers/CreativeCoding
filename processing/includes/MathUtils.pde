float getDistanceBetweenPoints (Point p1, Point p2) {
	float _x = p2.x - p1.x;
	float _y = p2.y - p1.y;

	return sqrt(_x * _x + _y * _y);
}

float getAngleOfLine (Point p1, Point p2) {
	float dy = p2.y - p1.y;
	float dx = p2.x - p1.x;

	return atan2(dy,dx);
}


Point getCenterPointOfLine(Point p1, Point p2) {
	float angle = getAngleOfLine(p1, p2);
	float length = getDistanceBetweenPoints(p1, p2);

	Point p3 = new Point();
	p3.x = cos(angle) * (length / 2);
	p3.y = sin(angle) * (length / 2);

	p3.x = p3.x + p1.x;
	p3.y = p3.y + p1.y;

	return p3;
}

Point getPointOnCircleAlongLine (Point centerPoint1, float radius1, Point centerPoint2) {
	float angle = getAngleOfLine(centerPoint1, centerPoint2);

	Point p3 = new Point();
	p3.x = cos(angle) * radius1;
	p3.y = sin(angle) * radius1;

	p3.x = p3.x + centerPoint1.x;
	p3.y = p3.y + centerPoint1.y;

	return p3;
}