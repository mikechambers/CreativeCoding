#include ../includes/MathUtils.pde
#include ../includes/Utils.pde

Point[] points;

void settings() {
	size(100, 500, FX2D);

	//this smooth call seems to be ignored
	smooth(4);
}

void setup() {
	Bounds bounds = new Bounds(0,0, 500,500);

	surface.setResizable(true);
	surface.setSize(int(bounds.width), int(bounds.height));

	int pointCount = 20;
	points = new Point[pointCount];

	for(int i = 0; i < pointCount; i++) {
		points[i] = getRandomPointInBounds(bounds);
	}
}

Boolean hasRendered = false;
int count = 0;


void draw() {

	//workaround processing bug
	//https://github.com/processing/processing/issues/4209
	if(count++ < 3) {
		return;
	}

	if(hasRendered) {
		return;
	}

	render();
	hasRendered = true;
}

void render() {

	System.out.println("render");

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