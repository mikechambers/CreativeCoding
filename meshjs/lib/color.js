import { randomInt } from "./math.js";

/**
 * Represents RGBA colors.
 * @example
 * let color = new new Color(255, 255, 0, 1.0);
 */
export default class Color {
	/**
	 * Constructor.
	 * @param {number} r Red value of color, between 0 - 255.
	 * @param {number} g Green value of color, between 0 - 255.
	 * @param {number} b Red value of color, between 0 - 255.
	 * @param {float} a Alpha value of color between 0.0 and 1.0.
	 */
	constructor(r = 0, g = 0, b = 0, a = 1.0) {
		if (arguments.length === 1) {
			g = r;
			b = r;
		}

		this._r = r;
		this._g = g;
		this._b = b;
		this._a = a;
	}

	/** @type {number} Red value of RGB color as a value between 0 and 255. */
	get red() {
		return this._r;
	}

	/** @type {number} Red value of RGB color as a value between 0 and 255. */
	set red(r) {
		this._r = r;
	}

	/** @type {number} Green value of RGB color as a value between 0 and 255. */
	get green() {
		return this._g;
	}

	/** @type {number} Green value of RGB color as a value between 0 and 255. */
	set green(g) {
		this._g = r;
	}

	/** @type {number} Blue value of RGB color as a value between 0 and 255. */
	get blue() {
		return this._b;
	}

	/** @type {number} Blue value of RGB color as a value between 0 and 255. */
	set blue(b) {
		this._b = b;
	}

	/** @type {float} Alpha value of RGB color as a value between 0.0 and 1.0. */
	get alpha() {
		return this._a;
	}

	/** @type {float} Alpha value of RGB color as a value between 0.0 and 1.0. */
	set alpha(a) {
		this._a = a;
	}

	/**
	 * Whether the two colors represent the same RGB color.
	 * @param {Color} color - Color instance to compare for equality against this instance.
	 * @param {Boolean} ignoreAlpha - If true, alpha value will be ignored when comparing
	 * color equality. Otherwise alpha must also be equal.
	 */
	isEqual(color, ignoreAlpha = true) {
		let isEqual =
			this._r === color.red &&
			this._g === color.green &&
			this._b === color.blue;

		if (!ignoreAlpha) {
			isEqual = isEqual && this._a === color.alpha;
		}

		return isEqual;
	}

	toRGBA() {
		return Color.getRGBA(this._r, this._g, this._b, this._a);
	}

	//todo: include alpha output support?
	toHex() {
		return (
			"#" +
			numberToHexString(this._r) +
			numberToHexString(this._g) +
			numberToHexString(this._b)
		);
	}

	clone() {
		return new Color(this._r, this._g, this._b, this._a);
	}

	static get BLACK() {
		return new Color(0).clone();
	}

	static get WHITE() {
		return new Color(255).clone();
	}

	static fromHex(value) {
		return hexToRgb(value);
	}

	static getRGBA(r, g, b, a) {
		return `rgba(${r}, ${g}, ${b}, ${a})`;
	}

	static getRandom(alpha = 1.0) {
		return new Color(randomInt(255), randomInt(255), randomInt(255), alpha);
	}
}

function numberToHexString(num) {
	let hex = num.toString(16);

	if (hex.length == 1) {
		hex = `0${hex}`;
	}

	return hex;
}

//https://stackoverflow.com/a/5624139/10232
//todo: need to add support for RGBA
function hexToRgb(hex) {
	//todo: need to check if a number is being passed in:
	//0xFFFFFF

	if (!hex.startsWith("#")) {
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
