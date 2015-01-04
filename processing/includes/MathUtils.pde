float getDistanceBetweenPoints (Point p1, Point p2) {
	float _x = p2.x - p1.x;
	float _y = p2.y - p1.y;

	return sqrt(_x * _x + _y * _y);
}

//radians
float getAngleOfLine (Point p1, Point p2) {
	float dy = p2.y - p1.y;
	float dx = p2.x - p1.x;

	return atan2(dy,dx);
}

//angle specified in degrees or radians?
Point getPointOnCircle(Point centerPoint, float radius, float angle) {
	Point p3 = new Point();
	p3.x = cos(angle) * radius;
	p3.y = sin(angle) * radius;

	p3.x = p3.x + centerPoint.x;
	p3.y = p3.y + centerPoint.y;

	return p3;
}

Point getCenterPointOfLine(Point p1, Point p2) {
	float length = getDistanceBetweenPoints(p1, p2);

	return getPointOnLine(p1, p2, length / 2);
}

Point getPointOnLine(Point p1, Point p2, float distance) {
	float angle = getAngleOfLine(p1, p2);
	
	return getPointOnCircle(p1, distance, angle);
}

Point getPointOnCircleAlongLine (Point centerPoint1, float radius1, Point centerPoint2) {
	return getPointOnLine(centerPoint1, centerPoint2, radius1);

}

Point findPointOnQuadraticCurve(QuadraticCurve curve, float t) {
	return findPointOnQuadraticCurve(curve.p1, curve.p2, curve.cp, t);
}

Point findPointOnQuadraticCurve(Point p1, Point p2, Point cp, float t) {
	//http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Quadratic_B.C3.A9zier_curves
	float x = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * cp.x + t * t * p2.x;
	float y = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * cp.y + t * t * p2.y;

	return new Point(x,y);
}

//http://en.wikipedia.org/wiki/Centroid#Centroid_of_polygon
Point getCentroidOfPolygon(Point[] points) {
	float a = 0.0;
	int len = points.length;
	
	Point p0;
	Point p1;
	float _x = 0.0;
	float _y = 0.0;
	for(int i = 0; i < len; i++){

		if(i < len - 1) {
			p0 = points[i];
			p1 = points[i + 1];
		} else {
			p0 = points[i];
			p1 = points[0];
		}

		a += ((p0.x * p1.y) - (p1.x * p0.y));
		_x += ((p0.x + p1.x) * ((p0.x * p1.y) - (p1.x * p0.y)));
		_y += ((p0.y + p1.y) * ((p0.x * p1.y) - (p1.x * p0.y)));
	}

	a = a * 0.5;

	_x = _x / (6.0 * a);
	_y = _y / (6.0 * a);

	return new Point(_x, _y);
}

Point findLineIntersection(LineSegment ls1, LineSegment ls2) {
	return findLineIntersection(ls1.p1, ls1.p2, ls2.p1, ls2.p2);
}

//http://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line
Point findLineIntersection(Point p1, Point p2, Point p3, Point p4) {
	float _x =
	(
		(
			(
				(p1.x * p2.y) - 
				(p1.y * p2.x)
			) * 
			(p3.x - p4.x)
		) - 
		(
			(p1.x - p2.x) * 
			(
				(p3.x * p4.y) - 
				(p3.y * p4.x)
			)
		)
	) / 
	(
		(
			(p1.x - p2.x) * 
			(p3.y - p4.y)
		) - 
		(
			(p1.y - p2.y) * 
			(p3.x - p4.x)
		)
	);


	float _y =
	(
		(
			(
				(p1.x * p2.y) - 
				(p1.y * p2.x)
			) *
			(p3.y - p4.y)
		) - 
		(
			(p1.y - p2.y) *
			(
				(p3.x * p4.y) - 
				(p3.y * p4.x)
			)
		)
	) /
	(
		(
			(p1.x - p2.x) *
			(p3.y - p4.y)
		) - 
		(
			(p1.y - p2.y) * 
			(p3.x - p4.x)
		)
	);

	return new Point(_x, _y);
}
