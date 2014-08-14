

int bgColor = 0xFFFFFFFF;
void setup() {
	size(640, 640);

	frameRate(1);
	stroke(0xFF000000);
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

	pushMatrix();
	translate(100,100);

	int width = 20;
	int height = 20;

	int totalCols = 5; // needs to be an odd number
	int halfCols = ceil(float(totalCols) / 2);
	int rows = 20;
	println(halfCols);

	for(int i = 0; i < halfCols; i++) {
		for(int k = 0; k < rows; k++) {
			setFill();
			rect(width * i, height * k, width, height);

			if(i < halfCols - 1) {
				rect(width * (totalCols - i - 1), height * k, width, height);
			}
		}
	}
	popMatrix();



	
}

void mousePressed () {
	generateInvader();
}