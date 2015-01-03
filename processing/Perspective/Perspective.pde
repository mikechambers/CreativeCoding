
#include ../includes/Utils.pde
#include ../includes/MathUtils.pde


static class Config {
	static String name = "Burst";

	static color bgColor = 0xFF111111;
	static color strokeColor = 0xFFeeeeee;

	static int width = 750;
	static int height = 400;
}


Point lvp;
Point rvp;
LineSegment horizon;
Bounds bounds;
float dotRadius = 1;

void setup() {

	bounds = new Bounds(0,0, Config.width, Config.height);
	size(int(bounds.width), int(bounds.height));

	background(Config.bgColor);

	stroke(Config.strokeColor);
}

void renderHorizon() {

	int horizonY = 25;
	horizon = new LineSegment(new Point(0 ,horizonY), new Point(int(bounds.width), horizonY));

	drawLine(horizon);

	lvp = new Point(25, horizonY);
	rvp = new Point(int(bounds.width) - 25, horizonY);

	drawCircle(lvp, dotRadius);
	drawCircle(rvp, dotRadius);

}

void draw() {

	background(Config.bgColor);

	renderHorizon();

	Point mousePoint = getMousePoint();
	drawLine(lvp, mousePoint);
	drawLine(rvp, mousePoint);

	drawCircle(mousePoint, dotRadius);

	Point fTop = new Point(mousePoint.x, mousePoint.y - 100);


	Point leftBottomPoint = getPointOnLine(mousePoint, lvp, 100.0);
	drawCircle(leftBottomPoint, dotRadius);

	Point rightBottomPoint = getPointOnLine(mousePoint, rvp, 100.0);
	drawCircle(rightBottomPoint, dotRadius);

	//need to add function to detect where two lines intersect.
	//Point leftTopPoint = getPointOnLine(fTop, lvp, 100.0);
	//drawCircle(leftTopPoint, dotRadius);	

	drawCircle(fTop, dotRadius);

	drawLine(fTop, mousePoint);
	drawLine(fTop, lvp);
	drawLine(fTop, rvp);

	drawLine(rightBottomPoint, lvp);
	drawLine(leftBottomPoint, rvp);

	findLineIntersection(lvp, mousePoint, lvp, fTop);
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
				(p3.y - p4.x)
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


	println(_y);

	return new Point();
}