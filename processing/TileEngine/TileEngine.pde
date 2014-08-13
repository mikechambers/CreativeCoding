import java.util.Date;

#include ../includes/ColorThemeManager.java
#include ../includes/CaptureUtils.pde
#include ../includes/ColorThemes.java
#include ../includes/Utils.pde
#include ../includes/ImageData.pde
#include ../includes/MathUtils.pde

static class Config {

    static final String MODE_TRIANGLE = "MODE_TRIANGLE";
    static final String MODE_RECTANGLE = "MODE_RECTANGLE";
    static final String MODE_CIRCLE = "MODE_CIRCLE";

	static String name = "TileEngine";
	static int frameRate = 30;
	static Boolean recordPDF = false;
	static color bgColor = 0xFFEEEEEE;
	static color strokeColor = 0xFF111111;
	static int width = 640;
	static int height = 640;
	static Boolean useFill = true;
	static String colorThemeName = "HBCIRCLES1";
	static float fillAlpha = 1.0;
	static float BOUNDS_PADDING = 5.0;
	static float SHAPE_SPACING = 20.0;
	static Boolean useStroke = true;
	static String blendMode = "NORMAL";
	static int shapeWidth = 25;
	static int shapeHeight = 25;
	static float rotation = 0; // in angles
	static String imagePath = null;
    static String shapeMode = Config.MODE_RECTANGLE;
    static int cornerRadius = 0;
    static int smoothLevel = 0;
}

String suffix;
ColorThemeManager theme;
ImageData imageData;

void initConfig () {
	Config.BOUNDS_PADDING = 5;
	Config.SHAPE_SPACING = 5;
	Config.fillAlpha = 1.0;
	Config.useStroke = true;
	Config.strokeColor = 0xFF333333;
	Config.recordPDF = true;
	Config.colorThemeName = "HBCIRCLES2A";
	Config.blendMode = "NORMAL";
	Config.shapeWidth = 20;
	Config.shapeHeight = 20;
    Config.cornerRadius = 7;
    Config.smoothLevel = 4;
	//Config.imagePath = "../images/heart.jpg";
    //Config.shapeMode = Config.MODE_TRIANGLE;
    //Config.rotation = 25;
}

void initialize() {
	initConfig();

	theme = new ColorThemeManager(Config.colorThemeName);

    int[] t = {0xFFFFFFFF};
    theme.setTheme(t);

	Date d = new Date();
	suffix = String.valueOf(d.getTime());

	size(Config.width, Config.height);
    smooth(Config.smoothLevel);

	frameRate(Config.frameRate);

	if(Config.recordPDF) {
		beginPDFRecord();
	}

	background(Config.bgColor);
	fill(Config.bgColor);
	rect(-1,-1, width + 1, height + 1);

	if(Config.imagePath != null) {
		imageData = new ImageData(Config.imagePath, new Size(Config.width, Config.height));
	}
}

void setup() {
	initialize();
	createTiles();
}

void draw(){
}

void updateFill(Point[] points) {

    if(Config.useFill) {
        int _c = 0;

        if(imageData != null) {

            if(points.length == 1) {
                _c = imageData.getColor(points[0]);
            } else {
                _c = imageData.getColor(getCentroidOfPolygon(points));
            }
        } else {
            _c = theme.getRandomColor();
        }

        fill(setAlphaOfColor(_c, Config.fillAlpha));

    } else {
        noFill();
    }
}

void createTiles () {

    int i;
    Point point;
    
    int row = 0;
    int column = 0;
    float _x;
    float _y;
    
    Size size = new Size(Config.shapeWidth, Config.shapeHeight);
    
    setBlendModeByName(Config.blendMode);

    Boolean shouldContinue = true;
    while (shouldContinue) {
        
        _x = (column * size.width) + (Config.SHAPE_SPACING * column) + Config.BOUNDS_PADDING;
        
        if (_x + size.width + Config.BOUNDS_PADDING > Config.width) {
            column = 0;
            row++;
        }
        
        _x = (column * size.width) + (Config.SHAPE_SPACING * column) + Config.BOUNDS_PADDING;
        
        _y = row * size.height + (Config.SHAPE_SPACING * row) + Config.BOUNDS_PADDING;
        if (_y + size.height + Config.BOUNDS_PADDING > Config.height) {
            
            shouldContinue = false;
            break;
        }
        
        point = new Point(
            _x,
            _y
        );

        if(Config.useStroke) {
        	stroke(Config.strokeColor);
        } else {
        	noStroke();
        }

        pushMatrix();
        translate(point.x, point.y);
        rotate(radians(Config.rotation));

        if(Config.shapeMode == Config.MODE_CIRCLE) {
            Point[] points = {point};
            updateFill(points);
            ellipseMode(CORNER);
            ellipse(0, 0, size.width, size.height);
        } else if (Config.shapeMode == Config.MODE_RECTANGLE) {

            Point[] points = {
                point,
                new Point(point.x + size.width, point.y),
                new Point(point.x + size.width, point.y + size.height),
                new Point(point.x, point.y + size.width)
            };

            updateFill(points);

            rect(0, 0, size.width, size.height, Config.cornerRadius);
        } else if (Config.shapeMode == Config.MODE_TRIANGLE) {

            Point[] points = {
                new Point(point.x, point.y),
                new Point(point.x + size.width, point.y),
                new Point(point.x, point.y + size.height)
            };

            updateFill(points);

            beginShape();
            vertex(0, 0);
            vertex(0 + size.width, 0);
            vertex(0, 0 + size.height);
            endShape(CLOSE);

            points[0].x = point.x + size.width;
            points[0].y = point.y;
            points[1].x = point.x;
            points[1].y = point.y + size.height;
            points[2].x = point.x + size.width;
            points[2].y = point.y + size.height;

            updateFill(points);

            beginShape();
            vertex(0 + size.width, 0);
            vertex(0, 0 + size.height);
            vertex(0 + size.width, 0 + size.height);
            endShape(CLOSE);

        } else {
            println("Unregonized Config.shapeMode :" + Config.shapeMode);
        }

        popMatrix();

        column++;
    }
};


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

