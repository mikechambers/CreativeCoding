#include ../includes/ColorThemeManager.java
#include ../includes/ColorThemes.java
#include ../includes/CaptureUtils.pde
#include ../includes/Utils.pde
#include ../includes/MathUtils.pde
#include ../includes/Ribbon.pde
#include ../includes/ImageData.pde

import java.util.Date;

static class Config {
	static String name = "BezierRibbons";
	static int frameRate = 30;
	static Boolean recordPDF = false;
	static color bgColor = 0xFF111111;
	static color strokeColor = 0xFFFFFFFF;
	static int width = 640;
	static int height = 640;
	static Boolean useFill = false;
	static String colorThemeName = "HBCIRCLES1";
	static float fillAlpha = 1.0;
	static Boolean animateRibbon = false;
	static int maxRibbonLength = 20;
	static int movementThreshold = 0;
	static String imageDataPath = null;
}

ColorThemeManager theme;
Ribbon ribbon;
ImageData imageData;

void initConfig () {

	Config.recordPDF = true;
	Config.frameRate = 60;

	Config.bgColor = 0xFFFFFFFF;
	Config.strokeColor = 0x00111111;

	Config.useFill = true;
	Config.fillAlpha = 0.5;
	Config.animateRibbon = false;
	Config.maxRibbonLength = 100;
	Config.movementThreshold = 5;

	Config.imageDataPath = "../images/sfsunset874x874.png";
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

	background(Config.bgColor);
	fill(Config.bgColor);
	rect(-1,-1, width + 1, height + 1);
}

void setup () {
	initialize();

	if(Config.imageDataPath != null) {
		imageData = new ImageData(Config.imageDataPath, new Size(Config.width, Config.height));
		ribbon = new Ribbon(imageData);
	} else {
		ribbon = new Ribbon(theme);
	}

	ribbon.useFill = Config.useFill;
	ribbon.strokeColor = Config.strokeColor;
	ribbon.fillAlpha = Config.fillAlpha;
	ribbon.animateRibbon = Config.animateRibbon;
	ribbon.maxRibbonLength = Config.maxRibbonLength;
}


void draw() {

	background(Config.bgColor);

	ribbon.render();
}

Point _lastPoint;
void mouseMoved () {

	Point mousePoint = new Point(mouseX, mouseY);

	if(_lastPoint != null) {
		float distance = getDistanceBetweenPoints(_lastPoint, mousePoint);

		if(distance < Config.movementThreshold) {
			return;
		}
	}

	_lastPoint = mousePoint;
	ribbon.addControlPoint(mousePoint);
}

void renderToPDF() {
	if(Config.recordPDF) {
		beginPDFRecord();
	}

	ribbon.render();

	savePDF();
}

void keyReleased () {
	if (key == ' ') {
		paused = !paused;
	}	else if (key == 'p') {
		saveImage();
	} else if (key == 'j') {
		saveConfig();
	} else if (key == 'd') {
		renderToPDF();
	} else if (key == 'x') {
		exit();
	} else if (key == 'a') {
		saveImage();
		saveConfig();
		renderToPDF();
	}
}
