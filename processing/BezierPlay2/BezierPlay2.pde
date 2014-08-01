#include ../includes/Point.pde
#include ../includes/ColorThemeManager.pde
#include ../includes/ColorThemes.java
#include ../includes/CaptureUtils.pde
#include ../includes/Utils.pde

import java.util.Date;

static class Config {
	static String name = "BezierPlay2";
	static int frameRate = 30;
	static Boolean recordPDF = false;
	static color bgColor = 0xFF111111;
	static int width = 500;
	static int height = 500;
}

void initConfig () {
	Config.recordPDF = true;
	Config.frameRate = 60;
}

String suffix;


void initialize() {
	initConfig();

	Date d = new Date();
	suffix = String.valueOf(d.getTime());

	size(Config.height, Config.width);
	
    smooth(8);

	frameRate(Config.frameRate);

	if(Config.recordPDF) {
		beginPDFRecord();
	}

	fill(Config.bgColor);
	rect(-1,-1, width + 1, height + 1);
}

Point p1 = null;
Point p2 = null;
Point p3 = null;

Point cp1 = null;
Point cp2 = null;

void setup () {
	initialize();

	//fill(0xFFFFFFFF);
	stroke(0xFFFFFFFF);

	p1 = new Point(50,100);
	p2 = new Point(250,100);
	p3 = new Point(450,100);

	cp1 = new Point(p1.x + 100, p1.y + 50);
	cp2 = new Point(p2.x + 100, p2.y - 50);
}

float t = 0;
int direction = 1;
void draw() {

	t = t + (.01 * direction);

	if(t >= 1 || t <= 0) {
		direction *= -1;
	}

	background(Config.bgColor);

	drawCircle(cp1, 4);
	drawCircle(cp2, 4);

	beginShape();
	vertex(p1.x, p1.y);
	quadraticVertex(cp1.x, cp1.x, p2.x, p2.y);
	quadraticVertex(cp2.x, cp2.y, p3.x, p3.y);
	endShape();

	Point p = findPointOnQuadraticCurve(p1, p2, cp1, t);
	ellipseMode(CENTER);
	drawCircle(p, 2);
}

Point findPointOnQuadraticCurve(Point p1, Point p2, Point cp, float t) {
	//http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Quadratic_B.C3.A9zier_curves
	float x = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * cp.x + t * t * p2.x;
	float y = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * cp.y + t * t * p2.y;

	return new Point(x,y);
}

void keyReleased () {
	if (key == ' ') {
		paused = !paused;
	}	else if (key == 'p') {
		saveImage();
	} else if (key == 'j') {
		saveConfig();
	} else if (key == 'p') {
		savePDF();
	} else if (key == 'x') {
		exit();
	} else if (key == 'a') {
		saveImage();
		saveConfig();
		savePDF();
	}
}