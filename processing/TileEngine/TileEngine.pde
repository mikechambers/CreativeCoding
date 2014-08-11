import java.util.Date;

#include ../includes/ColorThemeManager.java
#include ../includes/CaptureUtils.pde
#include ../includes/ColorThemes.java
#include ../includes/Utils.pde
#include ../includes/ImageData.pde

static class Config {
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
	static float rotation = 0;
	static String imagePath = null;
}

String suffix;
ColorThemeManager theme;
ImageData imageData;

void initConfig () {
	Config.BOUNDS_PADDING = 1;
	Config.SHAPE_SPACING = 0;
	Config.fillAlpha = 1.0;
	Config.useStroke = false;
	Config.strokeColor = 0xFF333333;
	Config.recordPDF = true;
	Config.colorThemeName = "HBCIRCLES2A";
	Config.blendMode = "MULTIPLY";
	Config.shapeWidth = 20;
	Config.shapeHeight = 20;
	Config.imagePath = "../images/sfsunset874x874.png";
}

void initialize() {
	initConfig();

	theme = new ColorThemeManager(Config.colorThemeName);

	Date d = new Date();
	suffix = String.valueOf(d.getTime());

	size(Config.width, Config.height);
    smooth(0);

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

void createTiles () {
    
    //var out = [];
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

        if(Config.useFill) {
        	//int c = (imageData != null)?imageData.getColor(point):;

        	int c = 0;

        	if(imageData != null) {

        		Bounds b = new Bounds(point, size);
        		c = imageData.getColor(b.getCenterPoint());

        	} else {
        		c = theme.getRandomColor();
        	}

        	fill(setAlphaOfColor(c, Config.fillAlpha));

        } else {
        	noFill();
        }

        pushMatrix();
        //translate(point.x, point.y);
        //rotate(radians(Config.rotation));
        //rect(0, 0, size.width, size.height);

        //todo: need to get the color from the center point

        int c = imageData.getColor(new Point(point.x, point.y));
        fill(setAlphaOfColor(c, Config.fillAlpha));
        beginShape();
        vertex(point.x, point.y);
        vertex(point.x + size.width, point.y);
        vertex(point.x, point.y + size.height);
        endShape(CLOSE);

        c = imageData.getColor(new Point(point.x + size.width, point.y + size.height));
        fill(setAlphaOfColor(c, Config.fillAlpha));
        beginShape();
        vertex(point.x + size.width, point.y);
        vertex(point.x, point.y + size.height);
        vertex(point.x + size.width, point.y + size.height);
        endShape(CLOSE);

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

