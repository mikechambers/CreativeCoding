
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

/**
	Adapted from Processing.js
	https://github.com/processing-js/processing-js/blob/master/src/P5Functions/Math.js

	Processing.js
	Copyright (C) 2008 John Resig
	Copyright (C) 2009-2011; see the AUTHORS file for authors and
	copyright holders.

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


	tinylog lite JavaScript library
	Copyright (C) 2010 Eli Grey
	https://github.com/eligrey/tinylog
**/

let undef = undefined;
var internalRandomGenerator = function() { return Math.random(); };

/*
//this was included twice but wasnt being called. commenting out.
function lerp(value1, value2, amt) {
	return ((value2 - value1) * amt) + value1;
};
*/


// Pseudo-random generator
function Marsaglia(i1, i2) {
	// from http://www.math.uni-bielefeld.de/~sillke/ALGORITHMS/random/marsaglia-c
	var z=i1 || 362436069, w= i2 || 521288629;
	var intGenerator = function() {
		z=(36969*(z&65535)+(z>>>16)) & 0xFFFFFFFF;
		w=(18000*(w&65535)+(w>>>16)) & 0xFFFFFFFF;
		return (((z&0xFFFF)<<16) | (w&0xFFFF)) & 0xFFFFFFFF;
	};

	this.doubleGenerator = function() {
		var i = intGenerator() / 4294967296;
		return i < 0 ? 1 + i : i;
	};

	this.intGenerator = intGenerator;
}

Marsaglia.createRandomized = function() {
	var now = new Date();
	return new Marsaglia((now / 60000) & 0xFFFFFFFF, now & 0xFFFFFFFF);
};

// Noise functions and helpers
function PerlinNoise(seed) {
	var rnd = seed !== undef ? new Marsaglia(seed, (seed<<16)+(seed>>16)) : Marsaglia.createRandomized();
	var i, j;
	// http://www.noisemachine.com/talk1/17b.html
	// http://mrl.nyu.edu/~perlin/noise/
	// generate permutation
	var perm = new Uint8Array(512);
	for(i=0;i<256;++i) { perm[i] = i; }
	for(i=0;i<256;++i) {
		// NOTE: we can only do this because we've made sure the Marsaglia generator
		//			 gives us numbers where the last byte in a pseudo-random number is
		//			 still pseudo-random. If no 2nd argument is passed in the constructor,
		//			 that is no longer the case and this pair swap will always run identically.
		var t = perm[j = rnd.intGenerator() & 0xFF];
		perm[j] = perm[i];
		perm[i] = t;
	}

	// copy to avoid taking mod in perm[0];
	for(i=0;i<256;++i) { perm[i + 256] = perm[i]; }

	function grad3d(i,x,y,z) {
		let h = i & 15; // convert into 12 gradient directions
		let u = h<8 ? x : y,
			v = h<4 ? y : h===12||h===14 ? x : z;
		return ((h&1) === 0 ? u : -u) + ((h&2) === 0 ? v : -v);
	}

	function grad2d(i,x,y) {
		var v = (i & 1) === 0 ? x : y;
		return (i&2) === 0 ? -v : v;
	}

	function grad1d(i,x) {
		return (i&1) === 0 ? -x : x;
	}

	function lerp(t,a,b) { return a + t * (b - a); }

	// this.noise3d = function(x, y, z) {
	// 	let X = Math.floor(x)&255, Y = Math.floor(y)&255, Z = Math.floor(z)&255;
	// 	x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
	// 	let fx = (3-2*x)*x*x, fy = (3-2*y)*y*y, fz = (3-2*z)*z*z;
	// 	let p0 = perm[X]+Y, p00 = perm[p0] + Z, p01 = perm[p0 + 1] + Z,
	// 		p1 = perm[X + 1] + Y, p10 = perm[p1] + Z, p11 = perm[p1 + 1] + Z;
	// 	return lerp(fz,
	// 	lerp(fy, lerp(fx, grad3d(perm[p00], x, y, z), grad3d(perm[p10], x-1, y, z)),
	// 			 lerp(fx, grad3d(perm[p01], x, y-1, z), grad3d(perm[p11], x-1, y-1,z))),
	// 	lerp(fy, lerp(fx, grad3d(perm[p00 + 1], x, y, z-1), grad3d(perm[p10 + 1], x-1, y, z-1)),
	// 			 lerp(fx, grad3d(perm[p01 + 1], x, y-1, z-1), grad3d(perm[p11 + 1], x-1, y-1,z-1))));
	// };

	this.noise3d = function(x, y, z) {
		let X = Math.floor(x)&255, Y = Math.floor(y)&255, Z = Math.floor(z)&255;
		x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);

		let fx = (3-2*x)*x*x, fy = (3-2*y)*y*y, fz = (3-2*z)*z*z;
		let p0 = perm[X]+Y, p00 = perm[p0] + Z, p01 = perm[p0 + 1] + Z,
			p1 = perm[X + 1] + Y, p10 = perm[p1] + Z, p11 = perm[p1 + 1] + Z;
		return lerp(fz,
		lerp(fy, lerp(fx, grad3d(perm[p00], x, y, z), grad3d(perm[p10], x-1, y, z)),
				 lerp(fx, grad3d(perm[p01], x, y-1, z), grad3d(perm[p11], x-1, y-1,z))),
		lerp(fy, lerp(fx, grad3d(perm[p00 + 1], x, y, z-1), grad3d(perm[p10 + 1], x-1, y, z-1)),
				 lerp(fx, grad3d(perm[p01 + 1], x, y-1, z-1), grad3d(perm[p11 + 1], x-1, y-1,z-1))));
	};

	this.noise2d = function(x, y) {
		var X = Math.floor(x)&255, Y = Math.floor(y)&255;
		x -= Math.floor(x); y -= Math.floor(y);
		var fx = (3-2*x)*x*x, fy = (3-2*y)*y*y;
		var p0 = perm[X]+Y, p1 = perm[X + 1] + Y;
		return lerp(fy,
		lerp(fx, grad2d(perm[p0], x, y), grad2d(perm[p1], x-1, y)),
		lerp(fx, grad2d(perm[p0 + 1], x, y-1), grad2d(perm[p1 + 1], x-1, y-1)));
	};

	this.noise1d = function(x) {
		var X = Math.floor(x)&255;
		x -= Math.floor(x);
		var fx = (3-2*x)*x*x;
		return lerp(fx, grad1d(perm[X], x), grad1d(perm[X+1], x-1));
	};
}

// processing defaults
var noiseProfile = { generator: undef, octaves: 4, fallout: 0.5, seed: undef};

export function noise(x, y, z) {
	if(noiseProfile.generator === undef) {
		// caching
		noiseProfile.generator = new PerlinNoise(noiseProfile.seed);
	}
	var generator = noiseProfile.generator;
	var effect = 1, k = 1, sum = 0;
	for(var i=0; i<noiseProfile.octaves; ++i) {
		effect *= noiseProfile.fallout;
		switch (arguments.length) {
		case 1:
			sum += effect * (1 + generator.noise1d(k*x))/2; break;
		case 2:
			sum += effect * (1 + generator.noise2d(k*x, k*y))/2; break;
		case 3:
			sum += effect * (1 + generator.noise3d(k*x, k*y, k*z))/2; break;
		}
		k *= 2;
	}
	return sum;
};

/* currently these are not exposed outside of the module */
function noiseDetail(octaves, fallout) {
	noiseProfile.octaves = octaves;
	if(fallout !== undef) {
		noiseProfile.fallout = fallout;
	}
};

function noiseSeed(seed) {
	noiseProfile.seed = seed;
	noiseProfile.generator = undef;
};
