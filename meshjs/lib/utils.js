import { random } from "./math.js";
import Vector from "./vector.js";
import Circle from "./circle.js";

export function circleContainsPoint(center, radius, point) {
  if (center instanceof Circle) {
    center = center.center;
    point = radius;
    radius = center.radius;
  }

  return center.distance(point) < radius;
}

export function pointOnCircle(center, radius, angleInRadians) {
  let x = Math.cos(angleInRadians) * radius + center.x;
  let y = Math.sin(angleInRadians) * radius + center.y;

  return new Vector(x, y);
}

export function appendArray(arr1, arr2) {
  Array.prototype.push.apply(arr1, arr2);
}

//https://www.frankmitchell.org/2015/01/fisher-yates/
export function shuffleArray(arr) {
  let len = arr.length;

  if (len <= 1) {
    return arr;
  }

  for (let i = len - 1; i > 0; i -= 1) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}
