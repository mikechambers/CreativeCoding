import java.util.Date;

#include ../includes/ColorThemeManager.pde
#include ../includes/CaptureUtils.pde
#include ../includes/ColorThemes.java
#include ../includes/Point.pde
#include ../includes/Utils.pde
#include ../includes/ColorUtils.pde

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
}

String suffix;
ColorThemeManager theme;

void initConfig () {
	Config.BOUNDS_PADDING = 5;
	Config.SHAPE_SPACING = -10;
	Config.fillAlpha = 0.5;
	Config.useStroke = true;
	Config.strokeColor = 0xFF333333;
	Config.recordPDF = true;
	Config.colorThemeName = "HBCIRCLES2A";
	Config.blendMode = "NORMAL";
	Config.shapeWidth = 25;
	Config.shapeHeight = 25;
}

void initialize() {
	initConfig();

	theme = new ColorThemeManager(Config.colorThemeName);

	Date d = new Date();
	suffix = String.valueOf(d.getTime());

	size(Config.width, Config.height);

	frameRate(Config.frameRate);

	if(Config.recordPDF) {
		beginPDFRecord();
	}

	background(Config.bgColor);
	fill(Config.bgColor);
	rect(-1,-1, width + 1, height + 1);
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
        
        setBlendModeByName(Config.blendMode);

        if(Config.useStroke) {
        	stroke(Config.strokeColor);
        } else {
        	noStroke();
        }

        if(Config.useFill) {
        	fill(setAlphaOfColor(theme.getRandomColor(), Config.fillAlpha));
        } else {
        	noFill();
        }

        rect(point.x, point.y, size.width, size.height);

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

