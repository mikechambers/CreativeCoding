void drawCircle(Point p, float radius) {
	ellipse(p.x, p.y, radius * 2, radius * 2);
}

void drawLine(Point p1, Point p2) {
	//line(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
	line(p1.x, p1.y, p2.x, p2.y);
}

Point getRandomPoint(int padding) {

	Bounds bounds = new Bounds();
	bounds.x = padding;
	bounds.y = padding;
	bounds.width = width - (padding * 2);
	bounds.height = height - (padding * 2);

	return getRandomPointInBounds(bounds);
}

Point getRandomPointInBounds(Bounds bounds) {
	return new Point(
		random(bounds.x, bounds.width - bounds.x), 
		random(bounds.y, bounds.height - bounds.y)
	);
}

import java.awt.BasicStroke;
import java.awt.Graphics2D;
void strokeDash(float width) {

	BasicStroke pen;
	float[] dashes = { 2.0f};
	pen = new BasicStroke(width, BasicStroke.CAP_ROUND, BasicStroke.JOIN_MITER, 4.0f, dashes, 0.0f);

	Graphics2D g2 = ((PGraphicsJava2D) g).g2;
  	g2.setStroke(pen);
}

class QuadraticCurve {

	Point p1 = null;
	Point p2 = null;
	Point cp = null;
	QuadraticCurve (Point _p1, Point _p2, Point _cp) {
		p1 = _p1;
		p2 = _p2;
		cp = _cp;
	}

	QuadraticCurve () {
	}
}

void setBlendModeByName(String blendModeName) {
	int mode = BLEND;

	if(blendModeName == "REPLACE") {
		mode = REPLACE;
	} else if (blendModeName == "BLEND") {
		mode = BLEND;
	} else if (blendModeName == "ADD") {
		mode = ADD;
	} else if (blendModeName == "SUBTRACT") {
		mode = SUBTRACT;
	} else if (blendModeName == "LIGHTEST") {
		mode = LIGHTEST;
	}  else if (blendModeName == "DARKEST") {
		mode = DARKEST;
	} else if (blendModeName == "DIFFERENCE") {
		mode = DIFFERENCE;
	} else if (blendModeName == "EXCLUSION") {
		mode = EXCLUSION;
	} else if (blendModeName == "MULTIPLY") {
		mode = MULTIPLY;
	} else if (blendModeName == "SCREEN") {
		mode = SCREEN;
	}  else if (blendModeName == "OVERLAY") {
		mode = OVERLAY;
	} else if (blendModeName == "HARD_LIGHT") {
		mode = HARD_LIGHT;
	} else if (blendModeName == "SOFT_LIGHT") {
		mode = SOFT_LIGHT;
	} else if (blendModeName == "DODGE") {
		mode = DODGE;
	} else if (blendModeName == "BURN") {
		mode = BURN;
	}  else if (blendModeName == "NORMAL") {
		mode = BLEND;
	}

  blendMode(mode);
}

class Size {
	float width = 0.0;
	float height = 0.0;

	Size(float width, float height) {
		this.width = width;
		this.height = height;
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

	Bounds(float width, float height) {
		this(0, 0, width, height);
	}

	Bounds(Point p, Size s) {
		this(p.x, p.y, s.width, s.height);
	}

	Bounds(Size s) {
		this(0, 0, s.width, s.height);
	}

	Bounds() {
	}

	Point getCenterPoint() {
		Point p = new Point();
		p.x = (width / 2) + x;
		p.y = (height / 2) + y;

		return p;
	}
}

class Point {

	float x = 0.0;
	float y = 0.0;
	//float z = 0.0;

	Point (float x, float y) {
		this.x = x;
		this.y = y;
	}

	/*
	Point (float x, float y, float z) {
		this(x, y);
		this.z = z;
	}
	*/

	Point () {
	}

	Boolean equals(Point p) {
		//return (this.x == p.x && this.y == p.y && this.z == p.z);
		return (this.x == p.x && this.y == p.y);
	}

	@Override public String toString() {
		return "Point("+ x + ","+y+")";
	}

	Point copy() {
		return new Point(x, y);
	}
}

int setAlphaOfColor(int hexColor, float alpha) {
	int a = floor((255) * alpha);

	return (hexColor & 0xFFFFFF) | (a << 24);
}

void vertex(Point p) {
	vertex(p.x, p.y);
}

