
export default class Color {
	constructor(r = 0, g = 0, b = 0, a = 1.0) {

		if(arguments.length === 1) {
			g = r;
			b = r;
		}

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

	static fromHex(value) {
		return hexToRgb(value);
	}

	static getRGBA(r, g, b, a) {
		return `rgba(${r}, ${g}, ${b}, ${a})`;
	}
}

//https://stackoverflow.com/a/5624139/10232
function hexToRgb(hex) {

	//todo: need to check if a number is being passed in:
	//0xFFFFFF

	if(!hex.startsWith("#")) {
		hex = "#" + hex;
	}

	//console.log(hex);

    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	if (!result) {
		return undefined;
	}

	let c = new Color(
		parseInt(result[1], 16),
		parseInt(result[2], 16),
		parseInt(result[3], 16)
	);

	return c;
}
