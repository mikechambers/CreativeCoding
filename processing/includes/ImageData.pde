
//look into resize for scaling

class ImageData {

	private PImage img = null;
	private int[] pixels;

	ImageData () {
	}

	ImageData (String imageName) {
		initAndLoadWithImage(imageName);
	}

	ImageData(String imageName, Size s) {
		initAndLoadWithImage(imageName, s);
	}

	void initAndLoadWithImage (String imageName) {
		img = loadImage(imageName);

		img.loadPixels();
		pixels = img.pixels;
	}

	void initAndLoadWithImage (String imageName, Size s) {
		img = loadImage(imageName);

		img.resize(floor(s.width), floor(s.height));

		img.loadPixels();
		pixels = img.pixels;
	}

	int getColor(Point point) {
		return pixels[floor(point.x) + (floor(point.y) * img.width)];
	}

	String getHex(Point point) {
		int pixel = getColor(point);
		return hex(pixel);
	}

	RGBA getRGBA(Point point) {
		int pixel = getColor(point);

		RGBA out = new RGBA();
		out.r = (pixel >> 16) & 255;
		out.g = (pixel >> 8) & 255;
		out.b = pixel & 255;
		out.a = (pixel >> 24) & 255;

		return out;
	}
}


class RGBA {
	int r = 0;
	int g = 0;
	int b = 0;
	int a = 0;

	RGBA(int r, int g, int b, int a){
	}

	RGBA(){

	}
}