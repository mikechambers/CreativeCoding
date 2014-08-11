#include ../includes/ColorThemeManager.java
#include ../includes/ColorThemes.java
#include ../includes/CaptureUtils.pde
#include ../includes/Utils.pde
#include ../includes/MathUtils.pde
#include ../includes/Ribbon.pde
#include ../includes/ImageData.pde
#include ../includes/BouncingPoint.pde
#include ../includes/RotatingPoint.pde

import java.util.Date;

static class Config {
	static String name = "BezierRibbons2";
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
	static String blendMode = "NORMAL";
}

ColorThemeManager theme;
Ribbon ribbon;
ImageData imageData;

BouncingPoint trackPoint;
RotatingPoint targetPoint;

void initConfig () {
	Config.width = 640;
	Config.height = 640;

	Config.recordPDF = false;
	Config.frameRate = 60;

	Config.bgColor = 0xFFFFFFFF;
	Config.strokeColor = 0x00111111;

	Config.useFill = true;
	Config.fillAlpha = 10.0;
	Config.animateRibbon = false;
	Config.maxRibbonLength = 100;
	Config.movementThreshold = 30;

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

	if(Config.recordPDF) {
		beginPDFRecord();
	}

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

	trackPoint = new BouncingPoint(new Bounds(0,0, Config.width, Config.height), 5.0);
	targetPoint = new RotatingPoint(trackPoint.position, 50.0);


	setBlendModeByName(Config.blendMode);
}


Point _lastPoint;
void draw() {

	background(Config.bgColor);

	update();
	ribbon.render();
}


void update () {

	Point mousePoint = targetPoint.updatePosition(trackPoint.updatePosition());

		Bounds bounds = new Bounds(0,0, Config.width, Config.height);
		if(mousePoint.x < bounds.x) {
			return;
		} else if (mousePoint.x > bounds.x + bounds.width) {
			mousePoint.x = bounds.x + bounds.width;
			return;
		}

		if(mousePoint.y < bounds.y) {
			return;
		} else if (mousePoint.y > bounds.y + bounds.height) {
			return;
		}

	if(_lastPoint != null) {

		float distance = getDistanceBetweenPoints(_lastPoint, mousePoint);

		if(distance < Config.movementThreshold) {
			return;
		}
	}

	Point _copyPoint = mousePoint.copy();
	_lastPoint = _copyPoint;

	ribbon.addControlPoint(_copyPoint);
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
