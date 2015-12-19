import java.util.Date;

#include ../includes/Utils.pde
#include ../includes/ColorThemeManager.java
#include ../includes/CaptureUtils.pde
#include ../includes/ColorThemes.java

static class Config {
	static String name = "SinePlay";
	static int width = 640;
	static int height = 640;
	static color bgColor = 0xFFFFFFFF;
	static color strokeColor = 0x05000000;
	static String colorThemeName = "BLACK";
	//static String imagePath = "../images/sfo640x640.png";
	static Boolean recordPDF = false;
	static float amplitude = 1;
	static float xVelocity = 0.1;
	static float strokeAlpha = 0.01;

}

String suffix;
ColorThemeManager theme;

void initConfig () {
}

void setup() {
	initConfig();

	size(Config.width, Config.height);

	theme = new ColorThemeManager(Config.colorThemeName);

	Date d = new Date();
	suffix = String.valueOf(d.getTime());

	if(Config.recordPDF) {
		beginPDFRecord();
	}
}


Point lastPoint = new Point(0, 320);
void draw () {
	//background(0xFFFFFFFF);

	//noStroke();

	if(lastPoint.x > Config.width) {
		return;
	}

	

	stroke(setAlphaOfColor(theme.getNextColor(), Config.strokeAlpha));
	strokeWeight(1);

	//fill(0xFF000000);

	Point _p = new Point(lastPoint.x + Config.xVelocity, Config.amplitude * sin(lastPoint.x + Config.xVelocity) + (Config.height / 2));
	//drawCircle(_p, 5);

	drawLine(new Point(Config.width / 2, 0), _p);
	drawLine(new Point(Config.width, Config.height / 2), _p);
	drawLine(new Point(Config.width / 2, Config.height), _p);
	drawLine(new Point(0, Config.height / 2), _p);

	drawLine(new Point(0,0), _p);
	drawLine(new Point(Config.width,0), _p);
	drawLine(new Point(Config.width,Config.height), _p);
	drawLine(new Point(0,Config.height), _p);


	lastPoint = _p;
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