
#include ../includes/Utils.pde


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

	drawCircle(fTop, dotRadius);

	drawLine(fTop, mousePoint);
	drawLine(fTop, lvp);
	drawLine(fTop, rvp);

}