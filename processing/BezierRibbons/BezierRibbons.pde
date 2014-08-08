#include ../includes/Point.pde
#include ../includes/ColorThemeManager.pde
#include ../includes/ColorThemes.java
#include ../includes/CaptureUtils.pde
#include ../includes/Utils.pde
#include ../includes/MathUtils.pde
#include ../includes/ColorUtils.pde

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
	static String colorThemeName = "HBCIRCLES1";
	static float fillAlpha = 1.0;
	static Boolean animateRibbon = false;
	static int maxRibbonLength = 20;
}

ColorThemeManager theme;

void initConfig () {
	Config.width = 1280;
	Config.height = 720;

	Config.recordPDF = true;
	Config.frameRate = 60;

	Config.bgColor = 0xFFFFFFFF;
	Config.strokeColor = 0xFF111111;
	Config.drawControlPoint = false;

	Config.useFill = true;
	Config.fillAlpha = 0.8;
	Config.animateRibbon = true;
	Config.maxRibbonLength = 20;
}

String suffix;

void initialize() {
	initConfig();

	theme = new ColorThemeManager(Config.colorThemeName);

	Date d = new Date();
	suffix = String.valueOf(d.getTime());

	size(Config.width, Config.height);
	
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

	for (RibbonSegment segment : segments) {

		QuadraticCurve c = segment.curve;

		if(Config.useFill) {
			fill(
					setAlphaOfColor(segment.segmentColor, Config.fillAlpha)
				);
		}

		if(Config.drawControlPoint) {

			strokeWeight(1.0);
			drawCircle(c.cp, 2);
			strokeDash(0.5);
			drawLine(c.cp, c.p1);
			drawLine(c.cp, c.p2);
		}

		QuadraticCurve topCurve = new QuadraticCurve();
		QuadraticCurve bottomCurve = new QuadraticCurve();

		float angle = getAngleOfLine(c.p1, c.p2);
		angle = 0.0;
		topCurve.p1 = getPointOnCircle(c.p1, 20,  HALF_PI + angle);
		topCurve.p2 = getPointOnCircle(c.p2, 20,  HALF_PI + angle);
		topCurve.cp = getPointOnCircle(c.cp, 20,  HALF_PI + angle);

		bottomCurve.p1 = getPointOnCircle(c.p1, 20,  ((3 * PI)/2) + angle);
		bottomCurve.p2 = getPointOnCircle(c.p2, 20,  ((3 * PI)/2) + angle);
		bottomCurve.cp = getPointOnCircle(c.cp, 20,  ((3 * PI)/2) + angle);


		beginShape();
		strokeWeight(1.0);
		//vertex(c.p1.x, c.p1.y);
		//quadraticVertex(c.cp.x, c.cp.y, c.p2.x, c.p2.y);

		vertex(topCurve.p1.x, topCurve.p1.y);
		quadraticVertex(topCurve.cp.x, topCurve.cp.y, topCurve.p2.x, topCurve.p2.y);

		vertex(bottomCurve.p2.x, bottomCurve.p2.y);
		quadraticVertex(bottomCurve.cp.x, bottomCurve.cp.y, bottomCurve.p1.x, bottomCurve.p1.y);
		vertex(topCurve.p1.x, topCurve.p1.y);

		if(Config.useFill) {
			endShape(CLOSE);
		} else {
			endShape();
		}
	}
}

	
ArrayList<RibbonSegment> segments = new ArrayList<RibbonSegment>();

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

	if(segments.size() > 0) {
		QuadraticCurve _tmp = segments.get(segments.size() - 1).curve;
		currentCurve.p1 = _tmp.p2;
	} else {
		currentCurve.p1 = getCenterPointOfLine(lastCp, mousePoint);
	}

	currentCurve.p2 = getCenterPointOfLine(lastCp, mousePoint);

	segments.add(new RibbonSegment(currentCurve, theme.getNextColor()));

	lastCp = mousePoint;

	if(Config.animateRibbon && segments.size() > Config.maxRibbonLength) {
		segments.remove(0);
	}
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

class RibbonSegment {

	QuadraticCurve curve;
	int segmentColor;

	RibbonSegment(QuadraticCurve _curve, int _color) {
		curve = _curve;
		segmentColor = _color;
	}


}

