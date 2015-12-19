void setup() {
	size(720, 720, FX2D);
}

void draw() {
	colorMode(HSB, 360, 100, 100);

	rectMode(CENTER);
	noStroke();

	float _c = mouseY / 2;
	background(_c, 100, 100);

	fill(getCompliment(_c), 100, 100);
	rect(360, 360, 240, 240);
}


float getCompliment(float h) { 
    h+=180;
    while (h>=360.0) {
    	h-=360.0;
    	while (h<0.0) {
    		h+=360.0;
    		return h;
    	}
    };

    return h;
}