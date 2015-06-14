import java.util.Date;

#include ../includes/ColorThemeManager.java
#include ../includes/CaptureUtils.pde
#include ../includes/ColorThemes.java
#include ../includes/Utils.pde
#include ../includes/ImageData.pde
#include ../includes/MathUtils.pde
#include ../includes/InvaderFactory.pde

static class Config {

    static final String MODE_TRIANGLE = "MODE_TRIANGLE";
    static final String MODE_RECTANGLE = "MODE_RECTANGLE";
    static final String MODE_CIRCLE = "MODE_CIRCLE";
    static final String MODE_INVADER = "MODE_INVADER";
    static final String MODE_LINES = "MODE_LINES";
    static final String MODE_SHAPE = "MODE_SHAPE";
    static final String MODE_PIXEL_SHAPE = "MODE_PIXEL_SHAPE";

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
    static String shapePath = null;
    static String shapeMode = Config.MODE_RECTANGLE;
    static int cornerRadius = 0;
    static int smoothLevel = 0;
    static Boolean allowDuplicates = true;
    static int gridColumnLength = 5;
    static int gridRowLength = 5;
    static Boolean animate = false;
}

String suffix;
ColorThemeManager theme;
ImageData imageData;

void initConfig () {
	Config.BOUNDS_PADDING = 5;
	Config.SHAPE_SPACING = 1;
	Config.fillAlpha = 1.0;
	Config.useStroke = true;
	Config.strokeColor = 0xFF000000;
    Config.bgColor = 0xFFFFFFFF;
	Config.recordPDF = false;
	Config.colorThemeName = "POST_ASTEROID_ENVIRONMENT";
	Config.blendMode = "NORMAL";
	Config.shapeWidth = 10;
	Config.shapeHeight = 10;
    Config.cornerRadius = 0;
    Config.smoothLevel = 4;
	Config.imagePath = "../images/mesh_head640x640.png";
    Config.shapeMode = Config.MODE_PIXEL_SHAPE;
    //Config.rotation = 45;
    Config.allowDuplicates = false;
    Config.gridColumnLength = 10;
    Config.gridRowLength = 10;
    Config.shapePath = "../images/line.svg";
    //Config.animate = true;
}

void initialize() {
	initConfig();

	theme = new ColorThemeManager(Config.colorThemeName);

	Date d = new Date();
	suffix = String.valueOf(d.getTime());

    if(Config.shapeMode == Config.MODE_INVADER) {
        size(Config.width, Config.height, P2D);
    } else {
        size(Config.width, Config.height);
    }

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
    if(Config.animate) {
        background(Config.bgColor);
        createTiles();
    };
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

void createTiles () {
    
    int row = 0;
    int column = 0;
    float _x;
    float _y;
    
    Size size = new Size(Config.shapeWidth, Config.shapeHeight);
    
    setBlendModeByName(Config.blendMode);

    int _c = floor((Config.width - (Config.BOUNDS_PADDING * 2) ) / (Config.SHAPE_SPACING + size.width));
    int _r = floor((Config.height - (Config.BOUNDS_PADDING * 2) ) / (Config.SHAPE_SPACING + size.height));

    InvaderFactory invaderFactory = null;
    if(Config.shapeMode == Config.MODE_INVADER) {
        invaderFactory = new InvaderFactory(Config.gridColumnLength, Config.gridRowLength, size.width, size.height, Config.allowDuplicates);

        if((_c * _r) > invaderFactory.maxUniqueCombinations) {
            println("Warning : total slots greater than unique combinations. Forcing allowDuplicates to true");
            invaderFactory.allowDuplicates = true;
        }
    }

    PShape s = null;
    if(Config.shapeMode == Config.MODE_SHAPE || Config.shapeMode == Config.MODE_PIXEL_SHAPE) {
        s = loadShape(Config.shapePath);
    };

    Point point = new Point(0,0);
    for (int i = 0; i < _c; ++i) {
        for(int k = 0; k < _r; k++) {

            point.x = (i * size.width) + (Config.SHAPE_SPACING * i) + Config.BOUNDS_PADDING;
            point.y = (k * size.height) + (Config.SHAPE_SPACING * k) + Config.BOUNDS_PADDING;

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

            } else if (Config.shapeMode == Config.MODE_LINES) {
                generateLine(size);
            } else if (Config.shapeMode == Config.MODE_SHAPE) {
                //todo: fill out here
                //point.x
                //point.y

                //insert shapre here

                Point[] points = {point};


                color c = theme.getRandomColor();

                /*
                float R = red(c);
                float G = green(c);
                float B = blue(c);
                float minRGB = min(R,min(G,B));
                float maxRGB = max(R,max(G,B));
                float minPlusMax = minRGB + maxRGB;
                color complement = color(minPlusMax-R, minPlusMax-G, minPlusMax-B);
                */

                s.disableStyle();

                updateFill(points);
                noStroke();
                shape(s, 0, 0, size.width, size.height);
                s.enableStyle();

            } else if (Config.shapeMode == Config.MODE_PIXEL_SHAPE) {

                //based on the area of the space
                //updateFill(points);

               Point[] points = {
                    point,
                    new Point(point.x + size.width, point.y),
                    new Point(point.x + size.width, point.y + size.height),
                    new Point(point.x, point.y + size.width)
                };

                s.disableStyle();

    
                updateFill(points);
                noStroke();

                shape(s, 0, 0, size.width, size.height);
                s.enableStyle();


            } else if (Config.shapeMode == Config.MODE_INVADER) {

               Point[] points = {
                    point,
                    new Point(point.x + size.width, point.y),
                    new Point(point.x + size.width, point.y + size.height),
                    new Point(point.x, point.y + size.width)
                };

                invaderFactory.fillColor = updateFill(points);

                Invader invader = invaderFactory.generate();
                shape(invader.shape);
            } else {
                println("Unregonized Config.shapeMode :" + Config.shapeMode);
            }

            popMatrix();
        }
    }
};

void generateLine(Size size) {
    Point p = new Point(0,0);
    int r = int(random(0, 4));

    Point startPoint = null;
    switch(r){
        case 0:
            startPoint = p;
            break;
        case 1:
            startPoint = new Point(p.x + size.width, p.y);
            break;
        case 2:
            startPoint = new Point(p.x + size.width, p.y + size.height);
            break;
        case 3:
            startPoint = new Point(p.x, p.y + size.width);
            break;
    }

    r = int(random(0, 4));

    Point endPoint = null;
    switch(r){
        case 0:
            endPoint = p;
            break;
        case 1:
            endPoint = new Point(p.x + size.width, p.y);
            break;
        case 2:
            endPoint = new Point(p.x + size.width, p.y + size.height);
            break;
        case 3:
            endPoint = new Point(p.x, p.y + size.width);
            break;
    }

    if(startPoint.equals(endPoint)) {
        generateLine(size);
        return;
    }

    drawLine(startPoint, endPoint);
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

