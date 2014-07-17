
color bgColor = #111111;
color strokeColor = #eeeeee;
color fillColor = strokeColor;
float radius = 8;
Point lastPoint;


void setup () {
	size(400,400);
	stroke(255);

	background(bgColor);

	drawCircles(getRandomPoint());
}

void drawCircles (Point p2) {
	
	Point p1 = lastPoint;
	if(p1 == null) {
		p1 = getRandomPoint();
	}

	stroke(strokeColor);
	noFill();
	drawCircle(p1, radius);
	drawCircle(p2, radius);


	Point p1c = getPointOnCircleAlongLine(p1, radius, p2);
	Point p2c = getPointOnCircleAlongLine(p2, radius, p1);

	line(p1c.x, p1c.y, p2c.x, p2c.y);

	fill(fillColor);
	drawCircle(p1c, 2);
	drawCircle(p2c, 2);

	lastPoint = p2;
}

void mousePressed () {
	drawCircles(new Point(mouseX, mouseY));
}

void keyPressed () {
	if (key == 'x') {
		background(bgColor);
	}
}

void draw (){

}

/********** Utils **************/

void drawCircle(Point p, float radius) {
	ellipse(p.x, p.y, radius * 2, radius * 2);
}

/********** Point ***************/

Point getRandomPoint() {
	return new Point(random(width + 1), random(height + 1));
}

class Point {

	float x = 0.0;
	float y = 0.0;

	Point (float x, float y) {
		this.x = x;
		this.y = y;
	}

	Point () {
	}
}

class Bounds {

	float x = 0.0;
	float y = 0.0;
	float width = 0.0;
	float height = 0.0;
	Bounds (float x, float y, float width, float height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

}

/************* Math Utils *************/

float getDistanceBetweenPoints (Point p1, Point p2) {
	float _x = p2.x - p1.x;
	float _y = p2.y - p1.y;

	return sqrt(_x * _x + _y * _y);
}

float getAngleOfLine (Point p1, Point p2) {
	float dy = p2.y - p1.y;
	float dx = p2.x - p1.x;

	return atan2(dy,dx);
}

Point getPointOnCircleAlongLine (Point centerPoint1, float radius1, Point centerPoint2) {
	float angle = getAngleOfLine(centerPoint1, centerPoint2);

	Point p3 = new Point();
	p3.x = cos(angle) * radius1;
	p3.y = sin(angle) * radius1;

	p3.x = p3.x + centerPoint1.x;
	p3.y = p3.y + centerPoint1.y;

	return p3;
}
