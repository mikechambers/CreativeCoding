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

void setup () {
	initialize();

	fill(0xFFFFFFFF);
	stroke(0xFFFFFFFF);
}


void draw() {

}

Point lastPoint = null;
void mousePressed() {

	Point p = new Point(mouseX, mouseY);

	drawCircle(p, 1);

	if(lastPoint == null) {
		lastPoint = p;
		return;
	}

	drawLine(lastPoint, p);

	lastPoint = p;
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