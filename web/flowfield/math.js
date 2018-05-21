
export function random(min, max) {

	if(!max) {
		max = min;
		min = 0;
	}

	return Math.random() * (max - min) + min;
}

export function map(value, inputMin, inputMax, outputMin, outputMax) {
  return outputMin + (outputMax - outputMin) * ((value - inputMin) / (inputMax - inputMin));
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
