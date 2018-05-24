
//returns a random floating point number from min (inclusive) to max (exclusive)
// value >= min && value < max
export function random(min, max) {

	if(!max) {
		max = min;
		min = 0;
	}

	return Math.random() * (max - min) + min;
}

//returns a random int from min (inclusive) to max (exclusive)
// value >= min && value < max
export function randomInt(min, max) {

	if(!max) {
		max = min;
		min = 0;
	}

	return Math.floor(Math.random() * (max - min) + min);
}

export function map(value, inputMin, inputMax, outputMin, outputMax) {
  return outputMin + (outputMax - outputMin) * ((value - inputMin) / (inputMax - inputMin));
}

//https://stackoverflow.com/a/1186465/10232
//returns the greatest common divisor of two numbers
export function greatestCommonDivisor (a, b) {
    return (b == 0) ? a : greatestCommonDivisor (b, a % b);
}

/*
export function randomInclusive(min, max) {
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

	if(!max) {
		max = min;
		min = 0;
	}

	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
*/
