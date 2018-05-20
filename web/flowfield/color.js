

export default class Color {
	constructor(r = 0, g = 0, b = 0, a = 1.0) {
		this._r = r;
		this._g = g;
		this._b = b;
		this._a = a;
	}

	toRGBA() {
		return Color.getRGBA(this._r, this._g, this._b, this._a);
	}

	static getRGBA(r, g, b, a) {
		return `rgba(${r}, ${g}, ${b}, ${a})`;
	}
}
