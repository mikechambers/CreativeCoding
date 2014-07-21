
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