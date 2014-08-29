#include ../includes/MathUtils.pde
#include ../includes/Utils.pde

void setup() {

	size(500, 500, P2D);

	float startAngle = radians(0);
	float endAngle = radians(90);
	Point centerPoint = new Point(250, 250);
	float baseRadius = 50;


	PShape s = createShape(ARC, centerPoint.x, centerPoint.y, 50, 50, startAngle, endAngle);
	s.endShape();
	shape(s);


/*
	Point _arcPoint = getPointOnCircle(centerPoint, baseRadius, startAngle);
	s.vertex(_arcPoint.x, _arcPoint.y);

	_arcPoint = getPointOnCircle(centerPoint, baseRadius, endAngle);
	s.vertex(_arcPoint.x, _arcPoint.y);

	_arcPoint = getPointOnCircle(centerPoint, baseRadius + 50, startAngle);
	s.vertex(_arcPoint.x, _arcPoint.y);

	_arcPoint = getPointOnCircle(centerPoint, baseRadius + 50, endAngle);
	s.vertex(_arcPoint.x, _arcPoint.y);
*/
	//s.endShape(CLOSE);

	//shape(s);

}

void drawArc(Point centerPoint, float startAngle, float endAngle, float radius) {

	int steps = 3;

	Point _arcPoint;
	float angle;
	for(int i = 0; i < steps; i++) {
		angle = ((endAngle - startAngle) / steps) * i;
		_arcPoint = getPointOnCircle(centerPoint, radius, angle);

		vertex(_arcPoint.x, _arcPoint.y);
	}
}
