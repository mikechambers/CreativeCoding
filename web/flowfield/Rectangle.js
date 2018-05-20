
export default class Rectangle {

	//todo: check if it should be h / w or w / h (canvas clear)
	constructor(x, y, height, width) {
		this._x = x;
		this._y = y;
		this._height = height;
		this._width = width;
	}

	get height() {
		return this._height;
	}

	set height(height) {
		this._height = value;
	}

	get width(){
		return this._width;
	}

	set width(width){
		this._width = width;
	}

	get x(){
		return this._x;
	}

	set x(x) {
		this._x = x;
	}

	get y() {
		return this._y;
	}

	set y(y) {
		this._y = y;
	}

	scale(scale) {
		let r = new Rectangle(
			this._x,
			this._y,
			this._height * scale,
			this._width * scale
		);

		return r;
	}
}
