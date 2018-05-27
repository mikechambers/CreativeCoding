import Color from "../../lib/color.js";
import { random } from "../../lib/math.js";
import Vector from "../../lib/vector.js";

export default class Branch {
  constructor(start, end) {
    this._start = start;
    this._end = end;

    this._hasChildren = false;

    this._leafColor = Color.WHITE;
    this._leafRadius = 6;
    this._nodeRadius = 3;
    this._branchColor = Color.WHITE;
  }
  get hasChildren() {
    return this._hasChildren;
  }

  set leafColor(color) {
    this._leafColor = color;
  }

  set nodeRadius(radius) {
    this._nodeRadius = radius;
  }

  set leafRadius(radius) {
    this._leafRadius = radius;
  }

  set branchColor(color) {
    this._branchColor = color;
  }

  draw(ctx) {
    ctx.strokeStyle = this._branchColor.toRGBA();
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(this._start.x, this._start.y);
    ctx.lineTo(this._end.x, this._end.y);
    ctx.stroke();

    ctx.fillStyle = this._hasChildren
      ? Color.WHITE.toRGBA()
      : this._leafColor.toRGBA();
    ctx.moveTo(this._end.x, this._end.y);

    let r = this._hasChildren ? this._nodeRadius : this._leafRadius;

    ctx.arc(this._end.x, this._end.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  get length() {
    return this._start.distance(this._end);
  }

  spawn() {
    let b1 = this.createChild(random(0, Math.PI / 4));
    b1.leafColor = this._leafColor;
    let b2 = this.createChild(-random(0, Math.PI / 4));
    b2.leafColor = this._leafColor;

    this._hasChildren = true;
    return [b1, b2];
  }

  createChild(angle) {
    let dir = Vector.subtract(this._end, this._start);
    dir.rotate(angle);
    dir.multiply(random(0.5, 0.9));

    let end = Vector.add(this._end, dir);
    let b = new Branch(this._end, end);

    return b;
  }

  createChild2(angle) {
    let dir = this._end.subtract(this._start);
    dir.rotate(angle);
    dir = dir.multiply(random(0.5, 0.9));

    let end = this._end.add(dir);

    let b = new Branch(this._end, end);

    return b;
  }
}
