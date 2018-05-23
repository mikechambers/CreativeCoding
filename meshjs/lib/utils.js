import {random} from "./math.js"
import Vector from "./vector.js"

export function randomPointInBounds(bounds, padding = 0) {
	return new Vector(random(bounds.x, bounds.width), random(bounds.y, bounds.height));
}

export function randomPointsInBounds(bounds, count, padding = 0) {
	let out = new Array(count);

	for(let i = 0; i < count; i++) {
		out[i] = randomPointInBounds(bounds, padding);
	}

	return out;
}

export function pointIsInCircle(center, radius, point) {
	return center.distance(point) < radius;
}
