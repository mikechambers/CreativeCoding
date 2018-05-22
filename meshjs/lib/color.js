
export default class Color {
	constructor(r = 0, g = 0, b = 0, a = 1.0) {
		this._r = r;
		this._g = g;
		this._b = b;
		this._a = a;
	}

	get r() {
		return this._r;
	}

	set r(r) {
		this._r = r;
	}

	get g() {
		return this._g;
	}

	set g(g) {
		this._g = r;
	}

	get b() {
		return this._b;
	}

	set b(b) {
		this._b = b;
	}

	get a() {
		return this._a;
	}

	set a(a) {
		this._a = a;
	}

	toRGBA() {
		return Color.getRGBA(this._r, this._g, this._b, this._a);
	}

	static getRGBA(r, g, b, a) {
		return `rgba(${r}, ${g}, ${b}, ${a})`;
	}
}
