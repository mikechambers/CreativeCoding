#include ../includes/Utils.pde
#include ../includes/CaptureUtils.pde
#include ../includes/ColorThemes.java
#include ../includes/ColorThemeManager.java

import java.util.Date;
//import java.lang.reflect.*;
//import processing.pdf.*;

static class Config {
	static String name = "C1970Number26";

	static color bgColor = 0xFFFFFFFF;

	static int frameRate = 30;
	static Boolean recordPDF = false;

	static float radius = 63;
	static int padding = 30;
	static int rows = 7;
	static int circleCount = 5;
}

String suffix;
ColorThemeManager theme1 = new ColorThemeManager("HBCIRCLES1A");
ColorThemeManager theme2 = new ColorThemeManager("HBCIRCLES2A");

void initConfig () {
	Config.bgColor = 0xFFd7d2cf;
	Config.recordPDF = true;
}

void settings() {
	size(100,400, FX2D);
	smooth(8);
}

void initialize() {
	initConfig();
	surface.setResizable(true);

	Date d = new Date();
	suffix = String.valueOf(d.getTime());


	//7 number of Config.rows
	//30 Config.padding on each side
	int dimension = floor((Config.radius * Config.rows) + (Config.padding * 2));

	surface.setSize(dimension, dimension);

	frameRate(Config.frameRate);

	if(Config.recordPDF) {
		beginPDFRecord();
	}

	fill(Config.bgColor);
	rect(-1,-1, dimension + 1, dimension + 1);
}

void setup(){
	initialize();

	noStroke();
	render();
}

void render () {
	Point startPoint = new Point(Config.padding, Config.padding);

	float startX;
	float startY;
	float xModifier = 1;
	ColorThemeManager theme;

	int k = 0;
	int i = 0;
	for(k = 0; k < Config.rows; k++) {
		theme = ((k % 2) == 0)? theme2 : theme1;
		startY = startPoint.y + Config.radius + (Config.radius * k);

		xModifier = ((k % 2) == 0)?0:1;
		for(i = 0; i < Config.circleCount; i++) {

			startX = (startPoint.x + Config.radius + (Config.radius * xModifier) + (Config.radius * i));
			fill(theme.getNextColor());

			if(k < Config.rows - 1) {
				ellipse(startX, startY, Config.radius * 2, Config.radius * 2);
			} else {
				arc(startX, startY, Config.radius * 2, Config.radius * 2, PI, PI * 2, CHORD);
			}
		}
	}
}


void keyReleased () {
	if (key == ' ') {
		//paused = !paused;
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