#include ../includes/Point.pde
#include ../includes/ColorThemeManager.pde
#include ../includes/ColorThemes.java
#include ../includes/CaptureUtils.pde

import java.util.Date;

static class Config {
	static String name = "BezierPlay";
	static int frameRate = 30;
	static Boolean recordPDF = false;
	static color bgColor = 0xFFFFFFFF;
	static int width = 500;
	static int height = 500;
}

void initConfig () {
	Config.recordPDF = true;
}

String suffix;
ColorThemeManager theme = new ColorThemeManager(ColorThemes.HBCIRCLES2A);

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

	render();
}

	int peaks = 5;
	float wavelength = 100;
	float amplitude = wavelength * .75;

void render() {

	int rows = floor(height / amplitude) + 3;
	for(int i = 0; i < rows; i++) {
		fill(theme.getNextColor());
		drawSection(amplitude * (i - 1));
	}

	
}

void drawSection(float baseY) {

	Point startPoint = null;
	Point endPoint = null;
	int direction = 1;

	beginShape();
	for(int i = 0; i < peaks; i++) {

		direction = (i % 2 == 0)?-1:1;

		//height - (amplitude * 2)
		Point p1 = new Point(i * wavelength, baseY);
		Point p2 = new Point(p1.x + wavelength, baseY);

		if(i == 0) {
			startPoint = p1;
		}


		Point cp1 = new Point(p1.x, p1.y + (amplitude * direction));
		Point cp2 = new Point(p2.x, p2.y + (amplitude * direction));

		//bezier(p1.x, p1.y, cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y);

		vertex(p1.x, p1.y);
		bezierVertex(cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y);

		endPoint = p2;
	}

	vertex(width, height);
	vertex(0, height);
	vertex(startPoint.x, startPoint.y);
	endShape();
}

void draw() {

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