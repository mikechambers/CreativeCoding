#include ../includes/Utils.pde
#include ../includes/CaptureUtils.pde
#include ../includes/MathUtils.pde
#include ../includes/ColorThemeManager.java
#include ../includes/ColorThemes.java

import java.util.Date;
import java.lang.reflect.*;
import processing.pdf.*;

static class Config {
	static String name = "Ribbons";

	static color bgColor = 0xFFEEEEEE;
	static color strokeColor = 0xFF111111;

	static float radius = 1.0;

	static float strokeWeight = 1.0;

	static Boolean recordPDF = false;
	static float fillAlpha = 1.0;

	static int frameRate = 30;

	static String colorThemeName = "CROSSWALK";

	static float BASE_RIBBON_WIDTH = 20;

	static int width = 768;
	static int height = 432;
}


String suffix;

void initConfig () {
	Config.recordPDF = true;
	Config.strokeColor = 0xFF111111;
	Config.bgColor = 0xFFeeeeee;
	Config.fillAlpha = 0.5;
	Config.colorThemeName = "FLAT_DESIGN_COLORS";
        Config.strokeWeight = 0.0;
}

ColorThemeManager theme;

void initialize() {
	initConfig();

	Date d = new Date();
	suffix = String.valueOf(d.getTime());

	size(Config.width, Config.height);
	
        smooth(8);

	frameRate(Config.frameRate);

	theme = new ColorThemeManager(Config.colorThemeName);
	
        /********************************/
        //todo: need get figure out how to get rid of gaps
        //Config.fillAlpha = 1.0;
	//int[] r = {setAlphaOfColor(0xFFeeeeee, Config.fillAlpha)};
	//theme.addTheme("red", r);
	//theme.setTheme("red");

        /********************************/

	if(Config.recordPDF) {
		beginPDFRecord();
	}

	fill(Config.bgColor);
	rect(-1,-1, width + 1, height + 1);
}

void setup(){
	initialize();

	stroke(Config.strokeColor);
	strokeWeight(Config.strokeWeight);

        if(Config.strokeWeight == 0.0) {
          noStroke();
        }
}

void draw(){

}

Point lastPoint = null;
Point lastP3 = null;
Point lastP4 = null;
void mouseMoved() {
  Point p = new Point(mouseX, mouseY);

  //drawCircle(p, 2);
  
  if(lastPoint != null) {

	  float distance = getDistanceBetweenPoints(lastPoint, p);

	  if(distance < 40) {
	  	return;
	  }

    //line(p.x, p.y, lastPoint.x, lastPoint.y);
    
    Point centerPoint = getCenterPointOfLine(lastPoint, p);

    //drawCircle(centerPoint, 5);

    float angle = getAngleOfLine(lastPoint, p);

    //this works well, but side angles are always 90 degress
    //Point p1 = new Point(lastPoint.x, lastPoint.y - 10);
    //Point p2 = new Point(lastPoint.x, lastPoint.y + 10);
    //Point p3 = new Point(p.x, p.y + 10);
    //Point p4 = new Point(p.x, p.y - 10);


    Point p1;
    Point p2;

    if(lastP3 != null) {
    	p1 = lastP4;
    	p2 = lastP3;
    } else {
    	p1 = getPointOnCircle(lastPoint, Config.BASE_RIBBON_WIDTH,  HALF_PI + angle);
    	p2 = getPointOnCircle(lastPoint, Config.BASE_RIBBON_WIDTH, ((3 * PI)/2) + angle);
    }
    
    Point p3 = getPointOnCircle(p, Config.BASE_RIBBON_WIDTH, ((3 * PI)/2) + angle);
    Point p4 = getPointOnCircle(p, Config.BASE_RIBBON_WIDTH, HALF_PI + angle);

    fill(setAlphaOfColor(theme.getRandomColor(), Config.fillAlpha));

    beginShape();
    vertex(p1.x, p1.y);
    vertex(p2.x, p2.y);
    vertex(p3.x, p3.y);
    vertex(p4.x, p4.y);
    endShape(CLOSE);

    lastP3 = p3;
    lastP4 = p4;
  }
  
  lastPoint = p;
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

