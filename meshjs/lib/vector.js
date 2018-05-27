import { random } from "./math.js";

export default class Vector {
  constructor(x = 0, y = 0) {
    this._x = x;
    this._y = y;
  }

  get x() {
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

  get magnitude() {
    return Math.sqrt(this._x * this._x + this._y * this._y);
  }

  set magnitude(magnitude) {
    this.normalize();
    this.multiply(magnitude);
  }

  get heading() {
    return Math.atan2(this._y, this._x);
  }

  distance(vector) {
    let x = vector.x - this._x;
    let y = vector.y - this._y;
    return Math.sqrt(x * x + y * y);
  }

  normalize() {
    let m = this.magnitude;

    if (m > 0) {
      this.divide(m);
    }
  }

  limit(max) {
    if (this.magnitude > max) {
      this.normalize();
      this.multiply(max);
    }
  }

  add(vector) {
    this._x += vector.x;
    this._y += vector.y;
  }

  subtract(vector) {
    this._x -= vector.x;
    this._y -= vector.y;
  }

  multiply(value) {
    this._x *= value;
    this._y *= value;
  }

  divide(value) {
    this._x /= value;
    this._y /= value;
  }

  rotate(angle) {
    let h = this.heading + angle;
    var m = this.magnitude;
    this._x = Math.cos(h) * m;
    this._y = Math.sin(h) * m;
  }

  clone() {
    return new Vector(this._x, this._y);
  }

  static fromAngle(angleInRads = 0) {
    let v = new Vector();
    v.x = Math.cos(angleInRads);
    v.y = Math.sin(angleInRads);

    return v;
  }

  static add(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }

  static subtract(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }

  static divide(v1, value) {
    return new Vector(v1.x / value, v1.y / value);
  }

  static multiply(v1, value) {
    return new Vector(v1.x * value, v1.y * value);
  }

  //todo: maybe add option for min / max range
  //todo: should this just be a standalone function and not a static
  //method?
  static getRandom(max = 1) {
    return new Vector(random(-max, max), random(-max, max));
  }

  clone() {
    return new Vector(this._x, this._y);
  }
}
