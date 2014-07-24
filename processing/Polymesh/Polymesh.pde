#include ../includes/Utils.pde
#include ../includes/MathUtils.pde
#include ../includes/Point.pde

import java.util.Date;
import java.lang.reflect.*;
import processing.pdf.*;

static class Config {
	static String name = "Polymesh";

	static color bgColor = 0xFFeeeeee;
	static color strokeColor = 0xFFeeeeee;
	static color fillColor = 0xFFeeeeee;
	static float strokeWeight = 1.0;
	static Boolean enableMouse = true;

	static Boolean recordPDF = false;
	static float fillAlpha = 1.0;

	static int padding = 0;

	static int vertextLimit = 3;
	
	static float radius = 2.0;

	static Boolean dofill = false;

	static Boolean drawLines = true;

	static Boolean scaleRadius = true;

	static int frameRate = 30;

	static int blendMode = NORMAL;

	static int width = 400;
	static int height = 400;

	static String colorTheme = "CROSSWALK";
}

void initConfig () {
	Config.bgColor = 0xFFFFFFFF;
	Config.strokeColor = 0x111111;
	Config.strokeWeight = 0.2;
	Config.width = 800;
	Config.height = 800;

	Config.fillAlpha = 0.17;
	Config.vertextLimit = 8;

	Config.recordPDF = true;

	Config.padding = 100;

	Config.enableMouse = false;

	Config.colorTheme = "FIRENZE";
}


String suffix;
ArrayList<Point> points;
Boolean paused = false;

int[] colors;

void initColors (){
	ColorThemes c = new ColorThemes();

	colors = c.getTheme(Config.colorTheme);

	int len = colors.length;

	for(int i = 0; i < len; i++) {
		colors[i] = ColorUtil.setAlphaOfColor(colors[i], Config.fillAlpha);
	}
}

void setup(){
	initConfig();
	initColors();

	Date d = new Date();
	suffix = String.valueOf(d.getTime());

	size(Config.width, Config.height);
	frameRate(Config.frameRate);

	if(Config.recordPDF) {
		beginPDFRecord();
	}

	fill(Config.bgColor);
	rect(-1,-1, width + 1, height + 1);

	points = new ArrayList<Point>();
	vertexes = new ArrayList<Point>();

	stroke(Config.strokeColor);
	strokeWeight(Config.strokeWeight);

	//blendMode(SUBTRACT);
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


ArrayList<Point> vertexes;
void draw(){

	if(paused) {
		return;
	}

	vertexes.add(getRandomPoint(Config.padding));

	int len = vertexes.size();

	if(len < Config.vertextLimit) {
		return;
	}

	fill(colors[floor(random(0, colors.length))]);

	Point p;
	beginShape();
	for(int i = 0; i < len; i++){
		p = vertexes.get(i);
		vertex(p.x, p.y);
	}
	endShape(CLOSE);

	vertexes.clear();
}

Point getNearestPointInVincinity(Point p){
	int len = points.size();

	float threshhold = 20.0;
	
	Point closest = p;
	float mindist = 999999999;

	float dist;
	Point _p;
	for(int i = 0; i < len; i++) {
		_p = points.get(i);

		dist = getDistanceBetweenPoints(_p, p);

		if(dist < threshhold && dist < mindist) {
			mindist = dist;
			closest = _p;
		}
	}

	return closest;
}


int pointCount = 0;
void mouseClicked() {

	if(!Config.enableMouse) {
		return;
	}

	Point _p = new Point(mouseX, mouseY);

	Point p = getNearestPointInVincinity(_p);

	if(p == _p) {
		points.add(p);
	}

	vertexes.add(p);

	fill(Config.strokeColor);
	drawCircle(p, Config.radius);
}

/************ utils **************/

void savePDF() {

	if(!Config.recordPDF) {
		return;
	}

	endRecord();
}

void beginPDFRecord () {
	String n = getSavePath("pdf");
	beginRecord(PDF, n);
}

void saveAll () {
	saveImage();
	saveConfig();
}

String getSavePath(String extension) {
	return "output/" + Config.name + "_" + suffix + "." + extension;
}

void saveConfig () {

	String n = getSavePath("config");
	PrintWriter output = createWriter(n);

	Field[] fields = Config.class.getDeclaredFields();
	for (Field f : fields) {
		f.setAccessible(true);
	    if (
	    		Modifier.isStatic(
	    			f.getModifiers()
	    		)
	    	) {

	    	try {
	    		output.println("Config." + f.getName() + " = " + (String.valueOf(f.get(null))) + ";");
	    	}
	    	catch (Exception e) {
	    		println(e.getMessage());
	    	}
	        
	    }

	}

	output.flush();
	output.close();
}

void saveImage() {
	String n = getSavePath("png");
	saveFrame(n);
}









