#include ../includes/MathUtils.pde
#include ../includes/Utils.pde

Point[] points;
void setup() {
	Bounds bounds = new Bounds(0,0, 500,500);
	size(int(bounds.width), int(bounds.height));

	int pointCount = 20;
	points = new Point[pointCount];

	for(int i = 0; i < pointCount; i++) {
		points[i] = getRandomPointInBounds(bounds);
	}

	render();
}

void render() {

	int len = points.length;
	for(int i = 0; i < len; i++) {
		Point p = points[i];

		drawCircle(p, 2);

		for(int k = 0; k < len; k++) {
			Point p2 = points[k];

			if(p == p2) {
				continue;
			}

			drawLine(p, p2);
		}


	}
}