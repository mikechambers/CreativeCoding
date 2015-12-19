import java.util.Date;

#include ../includes/ColorThemeManager.java
#include ../includes/CaptureUtils.pde
#include ../includes/ColorThemes.java
#include ../includes/ImageData.pde
#include ../includes/Utils.pde
#include ../includes/MathUtils.pde

static class Config {
	static String name = "Scan";
	static int width = 640;
	static int height = 640;
	static color bgColor = 0xFFFFFFFF;
	static color strokeColor = 0xFF111111;
	static Boolean useStroke = false;
	static String colorThemeName = "FLAT_DESIGN_COLORS";
	static String imagePath = "../images/sfo640x640.png";
	static Boolean recordPDF = false;
	static Boolean useFill = true;
	static float fillAlpha = 1.0;
	static Boolean randomizeHeight = false;
	static int minHeight = 400;
	static int columnWidth = 10;
}

String suffix;
ColorThemeManager theme;
ImageData imageData;

void initConfig () {
	Config.randomizeHeight = true;
	Config.useStroke = false;
	Config.strokeColor = 0xFFFFFFFF;
	Config.columnWidth = 10;
	Config.minHeight = 100;
	Config.recordPDF = true;
}

void setup() {
	initConfig();

	Date d = new Date();
	suffix = String.valueOf(d.getTime());

	theme = new ColorThemeManager(Config.colorThemeName);

	size(Config.width, Config.height);

	if(Config.recordPDF) {
		beginPDFRecord();
	}

	background(Config.bgColor);
	fill(Config.bgColor);
	rect(-1,-1, width + 1, height + 1);

	if(Config.imagePath != null) {
		imageData = new ImageData(Config.imagePath, new Size(Config.width, Config.height));
	}

	render();
}

void draw() {

}

void render () {
	int columnWidth = Config.columnWidth;

	int columnCount = Config.width / columnWidth;

	if(Config.useStroke) {
		stroke(Config.strokeColor);
	} else {
		noStroke();
	}

	int _h = Config.height;

	for (int i = 0; i < columnCount; i++) {

		if(Config.randomizeHeight) {
			_h = int(random(Config.minHeight, Config.height));
		}

		int baseY = (Config.height - _h) / 2;

		Point[] points = {
			new Point(columnWidth * i, baseY),
			new Point(((columnWidth * i) + columnWidth), baseY),
			new Point(((columnWidth * i) + columnWidth), _h),
			new Point(columnWidth * i, _h)
		};

		updateFill(points);
		rect(points[0].x, points[0].y, columnWidth, _h);

	}

}

int updateFill(Point[] points) {

    int _c = 0x00000000;
    if(Config.useFill) {

        if(imageData != null) {

            if(points.length == 1) {
                _c = imageData.getColor(points[0]);
            } else {
                _c = imageData.getColor(getCentroidOfPolygon(points));
            }
        } else {
            _c = theme.getRandomColor();
        }

        _c = setAlphaOfColor(_c, Config.fillAlpha);
        fill(_c);
    } else {
        noFill();
    }

    return _c;
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