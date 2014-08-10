#include ../includes/CaptureUtils.pde
#include ../includes/Utils.pde

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

