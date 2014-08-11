#include ../includes/BouncingPoint.pde
#include ../includes/RotatingPoint.pde
#include ../includes/Utils.pde
#include ../includes/MathUtils.pde

BouncingPoint p1;
RotatingPoint r1;
void setup() {
	size(640, 640);

	Bounds b = new Bounds(0,0,640,640);
	float velocity = 2;
	p1 = new BouncingPoint(b, velocity);
	r1 = new RotatingPoint(p1.position, 100.0);

}

void draw() {

	drawCircle(p1.updatePosition(), 1);
	drawCircle(r1.updatePosition(p1.position), 3);
}