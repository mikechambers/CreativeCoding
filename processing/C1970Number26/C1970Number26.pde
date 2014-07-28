#include ../includes/Point.pde
//#include ../includes/Utils.pde
#include ../includes/CaptureUtils.pde
//#include ../includes/MathUtils.pde
#include ../includes/ColorThemeManager.pde
//#include ../includes/ColorUtils.pde
#include ../includes/ColorThemes.java

//30 pixel border around, radius 56 pixel, 5 colors, half overlap


import java.util.Date;
import java.lang.reflect.*;
import processing.pdf.*;

static class Config {
	static String name = "C1970Number26";

	static color bgColor = 0xFFFFFFFF;
	static float radius = 1.0;

	static int frameRate = 30;
	static Boolean recordPDF = false;

	static int width = 500;
	static int height = 500;
}


String suffix;
ColorThemeManager theme1 = new ColorThemeManager(ColorThemes.HBCIRCLES1);
ColorThemeManager theme2 = new ColorThemeManager(ColorThemes.HBCIRCLES2);

void initConfig () {
	Config.recordPDF = true;
}

void initialize() {
	initConfig();

	Date d = new Date();
	suffix = String.valueOf(d.getTime());

	size(Config.width, Config.height);
	
    smooth(8);

	frameRate(Config.frameRate);

	if(Config.recordPDF) {
		beginPDFRecord();
	}

	fill(Config.bgColor);
	rect(-1,-1, width + 1, height + 1);
}

void setup(){
	initialize();

	noStroke();
	render();
}

void render () {
	
	Point startPoint = new Point(30,30);
	float radius = 63;

	float startX;
	float startY;
	float xModifier = 1;
	ColorThemeManager theme;

	int rows = 7;

	int k = 0;
	int i = 0;
	for(k = 0; k < rows; k++) {
		theme = ((k % 2) == 0)? theme2 : theme1;
		startY = startPoint.y + radius + (radius * k);

		xModifier = ((k % 2) == 0)?0:1;
		for(i = 0; i < 5; i++) {

			startX = (startPoint.x + radius + (radius * xModifier) + (radius * i));
			fill(theme.getNextColor());

			if(k < rows - 1) {
				ellipse(startX, startY, radius * 2, radius * 2);
			} else {
				arc(startX, startY, radius * 2, radius * 2, PI, PI * 2, CHORD);
			}
		}
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