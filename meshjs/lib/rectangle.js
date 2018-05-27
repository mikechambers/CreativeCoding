import Vector from "./vector.js";

export default class Rectangle {
  constructor(x, y, width, height) {
    this._x = x;
    this._y = y;
    this._height = height;
    this._width = width;
    this._updateCenter();
  }

  _updateCenter() {
    if (!this._center) {
      this._center = new Vector();
    }

    this._center.x = this._width / 2;
    this._center.y = this._height / 2;
  }

  get center() {
    return this._center;
  }

  get height() {
    return this._height;
  }

  set height(height) {
    this._height = height;
    this._updateCenter();
  }

  get width() {
    return this._width;
  }

  set width(width) {
    this._width = width;
    this._updateCenter();
  }

  get x() {
    return this._x;
  }

  set x(x) {
    this._x = x;
    this._updateCenter();
  }

  get y() {
    return this._y;
  }

  set y(y) {
    this._y = y;
    this._updateCenter();
  }

  //todo: do we need to return new instances here?
  get topLeft() {
    return new Vector(this._x, this._y);
  }

  get topRight() {
    return new Vector(this._width, this._y);
  }

  get bottomRight() {
    return new Vector(this._width, this._height);
  }

  get bottomLeft() {
    return new Vector(this._x, this._height);
  }

  //scales the rectangle by included amout. note, if you want to make a copy
  //first call clone : r.clone().scale(2);
  //todo: should this return a copy, similar to Vector. in which case call interval
  //withScale?
  scale(scale) {
    this._height *= scale;
    this._width += scale;
  }

  //returns a new instance of Rectangle, with dimensions based on existing
  //instance with padding applied to all 4 sides
  withPadding(padding) {
    let r = this.clone();

    r.x += padding;
    r.width -= padding * 2;

    r.y += padding;
    r.height -= padding * 2;

    return r;
  }

  randomPoint() {
    return new Vector(
      random(this._x, this._x + this._width),
      random(this._y, this._y + this._height)
    );
  }

  randomPoints(count) {
    let out = new Array(count);

    for (let i = 0; i < count; i++) {
      out[i] = this.randomPoint();
    }

    return out;
  }

  clone() {
    return new Rectangle(this._x, this._y, this._width, this._height);
  }
}
