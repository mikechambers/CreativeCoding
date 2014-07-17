import java.util.Date;
import java.lang.reflect.*;
import processing.pdf.*;

static class Config {
	static String name = "Burst";

	static color bgColor = 0xFF111111;
	static color strokeColor = 0xFFeeeeee;
	static color fillColor = 0xFFeeeeee;
	static float strokeWeight = 0.2;
	static int radius = 2;
	static float baseDistance = 10;
	static float distanceThreshhold = 80;
	static float distanceStepSize = 1;
	static Boolean rotate = true;
	static Boolean rotationNoise = false;

	static Boolean recordPDF = false;

	static float rotationStepSize = 10;

	static Boolean dofill = false;

	static Boolean drawLines = true;

	static Boolean scaleRadius = true;

	static int frameRate = 30;

	static int blendMode = NORMAL;

	static int width = 400;
	static int height = 400;
}

/********* modify config values here **************/
void initConfig () {

	Config.bgColor = 0xFFFFFFFF;
	Config.fillColor = 0xFF111111;
	Config.strokeColor = 0x88111111;

	Config.drawLines = false;

	Config.distanceThreshhold = 300;
	Config.radius = 2;
	Config.rotate = true;

	Config.distanceStepSize = 40;
	Config.rotationStepSize = 6;

	Config.width = 900;
	Config.height = 900;

	Config.blendMode = NORMAL ;

	Config.recordPDF = true;
}


String suffix;
Point centerPoint;
float distanceDirection = 1;
float rotation = 0;

float distance = Config.baseDistance;

void setup(){

	initConfig();

	Date d = new Date();
	suffix = String.valueOf(d.getTime());

	size(Config.width, Config.height);

	if(Config.recordPDF) {
		beginPDFRecord();
	}

	background(Config.bgColor);

	fill(Config.bgColor);
	rect(-1,-1, width + 1, height + 1);

	noFill();
	frameRate(Config.frameRate);
	
	if(Config.dofill) {
		fill(Config.fillColor);
	}

	centerPoint = new Point(width / 2, height / 2);

	stroke(Config.strokeColor);
	strokeWeight(Config.strokeWeight);

	blendMode(Config.blendMode);
	drawCircle(centerPoint, Config.radius);
}

void draw() {

	//background(bgColor);
	

	Point p = new Point();
	float angle;
	float rotationModifier = 0;

	for(int i = 0; i < 360; i += (360 / Config.rotationStepSize)) {

		if(Config.rotate) {
			rotationModifier = rotation++;
		}

		if(Config.rotationNoise) {
			rotationModifier *= noise(i);
		}

		angle = radians(i + rotationModifier);

		p.x = (cos(angle) * distance) + centerPoint.x;
		p.y = (sin(angle) * distance) + centerPoint.y;

		//fill(Config.fillColor);
		drawCircle(p, Config.radius);

		if(Config.drawLines) {
			line(centerPoint.x, centerPoint.y, p.x, p.y);
		}
	}

	distance += Config.distanceStepSize * distanceDirection;

	if(abs(distance) > Config.distanceThreshhold) {
		distanceDirection *= -1;
	}

}

void keyReleased () {
	if (key == 'p') {
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

/********** Utils ****************/

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
	return "images/" + Config.name + "_" + suffix + "." + extension;
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
	    		output.println(f.getName() + " = " + (String.valueOf(f.get(null))));
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

void drawCircle(Point p, float radius) {
	ellipse(p.x, p.y, radius * 2, radius * 2);
}

/********** Point ***************/

Point getRandomPoint() {
	return new Point(random(width + 1), random(height + 1));
}

class Point {

	float x = 0.0;
	float y = 0.0;

	Point (float x, float y) {
		this.x = x;
		this.y = y;
	}

	Point () {
	}
}

/************* Math Utils *************/

float getDistanceBetweenPoints (Point p1, Point p2) {
	float _x = p2.x - p1.x;
	float _y = p2.y - p1.y;

	return sqrt(_x * _x + _y * _y);
}

float getAngleOfLine (Point p1, Point p2) {
	float dy = p2.y - p1.y;
	float dx = p2.x - p1.x;

	return atan2(dy,dx);
}

Point getPointOnCircleAlongLine (Point centerPoint1, float radius1, Point centerPoint2) {
	float angle = getAngleOfLine(centerPoint1, centerPoint2);

	Point p3 = new Point();
	p3.x = cos(angle) * radius1;
	p3.y = sin(angle) * radius1;

	p3.x = p3.x + centerPoint1.x;
	p3.y = p3.y + centerPoint1.y;

	return p3;
}
