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

	static int width = 768;
	static int height = 432;
}


String suffix;

void initConfig () {
  Point p = new Point(0,0);
}
 
void initialize() {

	initConfig();

	Date d = new Date();
	suffix = String.valueOf(d.getTime());

	size(Config.width, Config.height);
	
	frameRate(Config.frameRate);

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
}

void draw(){

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

