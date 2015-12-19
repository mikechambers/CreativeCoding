

import java.util.Date;

#include ../includes/Utils.pde
#include ../includes/CaptureUtils.pde
#include ../includes/ColorThemeManager.java
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
	static int BOUNDS_PADDING = 5;
}

String suffix;
ColorThemeManager theme;

ArrayList<Point> points = null;

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

	initPoints();
}

void draw() {

}

void initPoints () {

	int w = Config.width;
    int h = Config.height;

    //todo: might want to initialize this
	points = new ArrayList();
    
    int padding = Config.BOUNDS_PADDING;
    
    int i;
    int k;
    
    Point p;
    for (i = padding; i < h - padding; i++) {
        for (k = padding; k < w - padding; k++) {
            p = new Point(k, i);
            points.add(p);
        }
    }

    //points = _points.toArray(new Point[_points.size()]);
};

Point removeRandomCanvasPoint () {
    int len = points.size();
    
    if (len == 0) {
        throw new Error("No Canvas Points Left");
    }
    
    Point p = points.remove(floor(random(1) * len));
    
	return p;
};


ArrayList<PShape> shapes;
Point getRandomPointNotInRectangle () {
    //var p = Utils.getRandomPointInBoundsForRectangle(config.BOUNDS_PADDING, size, view);
    Point p = removeRandomCanvasPoint();
    
    var len = shapes.length;

    var r = new Rectangle(p, size);

    //var _t = Date.now();
    Boolean isInShape;
    PShape shape;
    var i;
    while (true) {
        isInShape = false;
        for (i = 0; i < len; i++) {
            shape = shapes[i];
            if (shape.bounds.intersects(r)) {
                p = removeRandomCanvasPoint();
                r.x = p.x;
                r.y = p.y;
                isInShape = true;
                break;
            }
        }
                
        if (!isInShape) {
            return p;
        }
        
        /*
        if (config.TIMEOUT && (Date.now() - _t > config.TIMEOUT)) {
            throw new Error("Timeout looking for points");
        }
        */
    }
    
    return null;
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


