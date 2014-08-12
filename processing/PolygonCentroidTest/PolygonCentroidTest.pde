#include ../includes/Utils.pde
#include ../includes/MathUtils.pde


Point[] points;
void setup() {

	size(640, 640);
	background(0xFFFFFFFF);

	points = new Point[10];

	noFill();
}

void draw() {

}

int count = 0;
void mousePressed() {

	if(count == 0) {
		background(0xFFFFFFFF);
	}

	Point _tmp = new Point(mouseX, mouseY);

	points[count++] = _tmp;

	drawCircle(_tmp, 2);

	int len = points.length;
	if(count == len) {
		Point p = getCentroidOfPolygon(points);
		drawCircle(p, 2);

		beginShape();

		for(int i = 0; i < len; i ++) {
			vertex(points[i].x, points[i].y);
		}

		endShape(CLOSE);

		count = 0;
	}
}