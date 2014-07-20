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
	frameRate(60);

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

Point getRandomPoint(int padding) {
	return new Point(random(padding, width - padding), random(padding, height - padding));
}

float getDistanceBetweenPoints (Point p1, Point p2) {
	float _x = p2.x - p1.x;
	float _y = p2.y - p1.y;

	return sqrt(_x * _x + _y * _y);
}

/********** Point ***************/

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

void drawCircle(Point p, float radius) {
	ellipse(p.x, p.y, radius * 2, radius * 2);
}

/*************** Color ********************/

/*
class Color {

	//if performance becomes an issue, we can just expose this
	//need it read only for public
	int _c = 0xFF000000;
	float _a = 1.0;

	Color(int hexColor, float alpha) {
		_c = hexColor;
		setAlpha(alpha);
	}

	Color(int hexColor) {
		_c = hexColor;
	}

	int getHex () {
		return _c;
	}

	color getColor(){
		return color(_c);
	}

	void setAlpha(float alpha) {

		float a = 255 * alpha;
		_a = alpha;
		_c = ColorUtil.setAlphaOfColor(_c, a);
	}

	float getAlpha() {
		return _a;
	}
}
*/

static class ColorUtil {
	static int setAlphaOfColor(int hexColor, float alpha) {
		int a = floor((255) * alpha);

		return (hexColor & 0xFFFFFF) | (a << 24);
	}
}

class ColorThemes {

	HashMap<String, int[]> themes = new HashMap<String, int[]>();

	ColorThemes(){

		int[] CROSSWALK = { 
		           0xEFC63A,
		           0xEFAE33,
		           0xBF4707,
		           0x7C0706,
		           0xEF281E
		};

		themes.put("CROSSWALK", CROSSWALK);

		int[] FLAT_DESIGN_COLORS = {
			0x334D5C,
			0x45B29D,
			0xEFC94C,
			0xE27A3F,
			0xDF4949
		};

		themes.put("FLAT_DESIGN_COLORS", FLAT_DESIGN_COLORS);

		int[] BLUE_SET = {
			0x244674,
			0x4873A8,
			0x9FB9D0,
			0x7CA3CC,
			0xCCDAE7
		};

		themes.put("BLUE_SET", BLUE_SET);

		int[] MONOCHROMATIC_LIGHT_BLUES = {
			0x71EEFF,
			0x127280,
			0x25E4FF,
			0x397780,
			0x1DB7CC
		};

		themes.put("MONOCHROMATIC_LIGHT_BLUES", MONOCHROMATIC_LIGHT_BLUES);

		int[] AQUA_SKY = {
			0x3CD6E8,
			0x42BAFF,
			0x4FFFE1,
			0x3CE89A,
			0x42FF74
		};

		themes.put("AQUA_SKY", AQUA_SKY);

		int[] FALL = {
			0x930626,
			0xD72620,
			0x422C0B,
			0xDEA220,
			0x1E4A01
		};

		themes.put("FALL", FALL);

		int[] FIRENZE = {
			0xE04946,
			0x3BA686,
			0xB6D15D,
			0xFFD495,
			0xFA847E
		}; 

		themes.put("FIRENZE", FIRENZE);
	}

	int[] getTheme(String name) {
		return themes.get(name);
	}
}




