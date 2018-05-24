import {random} from "./math.js"
import Vector from "./vector.js"

export function randomPointInBounds(bounds) {
	return new Vector(random(bounds.x, bounds.x + bounds.width),
		random(bounds.y, bounds.y + bounds.height));
}

export function randomPointsInBounds(bounds, count) {
	let out = new Array(count);

	for(let i = 0; i < count; i++) {
		out[i] = randomPointInBounds(bounds);
	}

	return out;
}

//todo: rename circleContainerPoint (or just move to circle?)
export function pointIsInCircle(center, radius, point) {
	return center.distance(point) < radius;
}

export function pointOnCircle(center, radius, angleInRadians) {
    let x = (Math.cos(angleInRadians) * radius) + center.x;
    let y = (Math.sin(angleInRadians) * radius) + center.y;

    return new Vector(x, y);
}

//https://www.frankmitchell.org/2015/01/fisher-yates/
export function shuffleArray (array) {
	let i = 0
		, j = 0
		, temp = null;

	let len = array.length;
	for (i = len - 1; i > 0; i -= 1) {
		j = Math.floor(Math.random() * (i + 1))
		temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}
