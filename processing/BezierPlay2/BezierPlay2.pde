#include ../includes/Point.pde
#include ../includes/ColorThemeManager.pde
#include ../includes/ColorThemes.java
#include ../includes/CaptureUtils.pde
#include ../includes/Utils.pde
#include ../includes/MathUtils.pde

import java.util.Date;

static class Config {
	static String name = "BezierPlay2";
	static int frameRate = 30;
	static Boolean recordPDF = false;
	static color bgColor = 0xFF111111;
	static color strokeColor = 0xFFFFFFFF;
	static int width = 640;
	static int height = 640;
	static Boolean drawControlPoint = false;
	static Boolean useFill = false;
	static int[] colorTheme = ColorThemes.HBCIRCLES1;
}

ColorThemeManager theme;

void initConfig () {
	Config.recordPDF = true;
	Config.frameRate = 60;

	Config.bgColor = 0xFFFFFFFF;
	Config.strokeColor = 0x00111111;
	Config.drawControlPoint = false;

	Config.useFill = true;
}

String suffix;

void initialize() {
	initConfig();

	theme = new ColorThemeManager(Config.colorTheme);

	Date d = new Date();
	suffix = String.valueOf(d.getTime());

	size(Config.height, Config.width);
	
    //smooth(4);

	frameRate(Config.frameRate);

	if(Config.recordPDF) {
		beginPDFRecord();
	}

	background(Config.bgColor);
	fill(Config.bgColor);
	rect(-1,-1, width + 1, height + 1);
}

void setup () {
	initialize();
}


void draw() {

	background(Config.bgColor);

	stroke(Config.strokeColor);
	
	noFill();

	theme.reset();
	for (QuadraticCurve c : curves) {

		if(Config.useFill) {
			fill(theme.getNextColor());
		}

		if(Config.drawControlPoint) {

			strokeWeight(1.0);
			drawCircle(c.cp, 2);
			strokeDash(0.5);
			drawLine(c.cp, c.p1);
			drawLine(c.cp, c.p2);
		}

		beginShape();
		strokeWeight(2.0);
		vertex(c.p1.x, c.p1.y);
		quadraticVertex(c.cp.x, c.cp.y, c.p2.x, c.p2.y);

		if(Config.useFill) {
			endShape(CLOSE);
		} else {
			endShape();
		}
	}
}

	
ArrayList<QuadraticCurve> curves = new ArrayList<QuadraticCurve>();

Point lastCp = null;
//QuadraticCurve currentCurve = null;

void mouseMoved () {

	Point mousePoint = new Point(mouseX, mouseY);

	//see if we are already constructing a curve
	if(lastCp == null) {
		lastCp = mousePoint;
		return;
	}

	QuadraticCurve currentCurve = new QuadraticCurve();

	currentCurve.cp = lastCp;

	if(curves.size() > 0) {
		QuadraticCurve _tmp = curves.get(curves.size() - 1);
		currentCurve.p1 = _tmp.p2;
	} else {
		currentCurve.p1 = getCenterPointOfLine(lastCp, mousePoint);
	}

	currentCurve.p2 = getCenterPointOfLine(lastCp, mousePoint);
	curves.add(currentCurve);

	lastCp = mousePoint;
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
