#include ../includes/Utils.pde
#include ../includes/InvaderFactory.pde

int bgColor = 0xFFFFFFFF;
InvaderFactory factory;

void settings(){
	size(640, 640, FX2D);
}

void setup() {

	frameRate(1);
	stroke(0xFF000000);

	factory = new InvaderFactory(5, 5, 50, 50, false);
}

void setFill() {
	noFill();
	if(random(1) > 0.5) {
		fill(0xFF000000);
	}
}

void draw() {
	generateInvader();
}

void generateInvader () {
	background(bgColor);

	Invader inv = factory.generate();
	shape(inv.shape);	
}

void mousePressed () {
	generateInvader();
}