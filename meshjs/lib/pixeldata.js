import Color from "./color.js"
import Vector from "./vector.js"

//for some reason i get an error if i try and set this as default export
export class PixelData {

	//note caching pixels can be really expensive
	constructor(imageData, cache = true) {
		this._imageData = imageData;

		this._cached = false;

		if(cache) {
			this.cachePixels();
		}
	}

	//note caching pixels can be really expensive
	//could consider adding lazy caching
	cachePixels() {

		let w = this._imageData.width;
		let h = this._imageData.height;
		this._colors = new Array(w * h);

		for(let y = 0; y < h; y++) {
			for(let x = 0; x < w; x++){
				let index = x + y * w;

				let c = this.getColor(x, y);
				this._colors[index] = c;
			}
		}

		this._cached = true;
	}


	/**
		Takes x, y cordinates or a single Vector instance
	*/
	getColor(x, y, alpha) {

		if(x instanceof Vector) {
			y = x.y;
			x = x.x;
		}

		x = Math.floor(x);
		y = Math.floor(y);

		let w = this._imageData.width;
		let h = this._imageData.height;

		if(x >= w || x < 0 || y >= h || y < 0) {
			console.log("out of bounds");
			return new Color(0,0,0,0);
		}

		//right now we either cache all or none. Could change to cache on
		//demand
		if(this._cached) {
			let index = x + y * w;

			return this._colors[index];
		}

		let offset = y * (w * 4) + x * 4;

		let r = this._imageData.data[offset];
		let g = this._imageData.data[offset + 1];
		let b = this._imageData.data[offset + 2];
		let a = this._imageData.data[offset + 3];

		if(alpha) {
			a = alpha;
		}

		let c = new Color(r, g, b, a);

		return c;
	}

	getImageData() {
		return this._imageData;
	}
}

//todo: add option to scale image to w / h
export function loadPixelDataFromPath(path, onload, cache = true) {
	let img = new Image();

	img.onload = function(event) {
		let w = img.naturalWidth;
		let h = img.naturalHeight;

		let c = document.createElement("canvas");
		c.width = w;
		c.height = w;

		let ctx = c.getContext("2d");
		ctx.drawImage(img, 0, 0);

		var imageData = ctx.getImageData(0, 0, w, h);
		let pd = new PixelData(imageData, cache);

		if(onload) {
			onload(pd, img);
		}
	}

	img.src = path;
}
