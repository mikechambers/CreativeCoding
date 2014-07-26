//#include ../includes/Point.pde
//#include ../includes/Utils.pde
#include ../includes/CaptureUtils.pde
//#include ../includes/MathUtils.pde
//#include ../includes/ColorThemeManager.pde
//#include ../includes/ColorUtils.pde
//#include ../includes/ColorThemes.java

//30 pixel border around, radius 56 pixel, 5 colors, half overlap


import java.util.Date;
import java.lang.reflect.*;
import processing.pdf.*;

static class Config {
	static String name = "C1970Number26";

	static color bgColor = 0xFFEEEEEE;
	static float radius = 1.0;

	static int frameRate = 30;
	static Boolean recordPDF = false;

	static int width = 500;
	static int height = 500;
}


String suffix;

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
}

void draw(){

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