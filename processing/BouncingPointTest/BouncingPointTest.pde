#include ../includes/BouncingPoint.pde
#include ../includes/Utils.pde

BouncingPoint p1;
BouncingPoint p2;
BouncingPoint p3;

void settings() {
	size(640, 640, FX2D);
}

void setup() {

	Bounds b = new Bounds(0,0,640,640);
	float velocity = 10;
	p1 = new BouncingPoint(b, velocity);
	p2 = new BouncingPoint(b, velocity);
	p3 = new BouncingPoint(b, velocity);
}

void draw() {
	drawCircle(p1.updatePosition(), 20);
	drawCircle(p2.updatePosition(), 20);
	drawCircle(p3.updatePosition(), 20);
}