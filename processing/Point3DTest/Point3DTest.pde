#include ../includes/Utils.pde

void setup() {
	size(640,640, P3D);

	Point p1 = new Point(100,100,100);
	Point p2 = new Point(100,300,300);
	Point p3 = new Point(100,300,300);


	drawLine(p1, p2);
	drawLine(p2, p3);
}

void draw() {

}