import Color from "./color.js"
import Vector from "./vector.js"

//for some reason i get an error if i try and set this as default export
export default class PixelData {

	//note caching pixels can be really expensive
	constructor(imageData, cache = false) {
		this._imageData = imageData;
		this._width = this._imageData.width;
		this._height = this._imageData.height;

		this._cached = false;

		if(cache) {
			this.cache();
		}
	}

	//note caching pixels can be really expensive
	//could consider adding lazy caching
	cache() {
		if(this._colors) {
			return;
		}

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

		//once cached we dont need imageData anymore, so we dereference so
		//it doesnt hold the memory
		this._imageData = null;
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

		let w = this._width;
		let h = this._height;

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

	//pass in a comparison function or a color
	//returns an array of vectors of positions that match
	//the mask
	mask(func) {

		if(func instanceof Color) {
			let filterColor = func;
			func = function(_c) {
				return filterColor.isEqual(_c);
			}
		}

		let out = [];

		let w = this._width;
		let h = this._height;

		for(let y = 0; y < h; y++){
			for(let x = 0; x < w; x++) {
				let c = this.getColor(x, y);
				if(func(c)) {
					out.push(new Vector(x, y));
				}
			}
		}

		return out;
	}

	get imageData() {
		return this._imageData;
	}
}

//add options to align differently
export function pixelDataFromImage(img, bounds, allowSkew = false) {
	let imgW = img.naturalWidth;
	let imgH = img.naturalHeight;
	let targetW = imgW;
	let targetH = imgH;

	//might need to floor() comparisons
	//check and see if there is a target bounds, and if
	//its different than img dimensions
	if(bounds && (
		bounds.width != imgW ||
		bounds.height != imgH
	)) {
		targetW = bounds.width;
		targetH = bounds.height;
	}

	let c = document.createElement("canvas");
	c.width = targetW;
	c.height = targetH;

	let ctx = c.getContext("2d");

	if(allowSkew) {
		ctx.drawImage(img, 0, 0, targetW, targetH);
	} else {

		//https://stackoverflow.com/a/3971875/10232
		var maxWidth = targetW; // Max width for the image
        var maxHeight = targetH;    // Max height for the image
        var ratio = 0;  // Used for aspect ratio
        var width = imgW;    // Current image width
        var height = imgH;  // Current image height

        // Check if the current width is larger than the max
        if(width > maxWidth){
            ratio = maxWidth / width;   // get ratio for scaling image
            height = height * ratio;    // Reset height to match scaled image
            width = width * ratio;    // Reset width to match scaled image
        }

        // Check if current height is larger than max
        if(height > maxHeight){
            ratio = maxHeight / height; // get ratio for scaling image
            width = width * ratio;    // Reset width to match scaled image
            height = height * ratio;    // Reset height to match scaled image
        }

        var xPos = Math.floor((targetW - width) / 2);
        var yPos = Math.floor((targetH - height) / 2);

        ctx.drawImage(img, xPos, yPos, width, height);
	}

	var imageData = ctx.getImageData(0, 0, targetW, targetH);
	let pd = new PixelData(imageData);

	return pd;
}

export function loadPixelDataFromPathWithBounds(path, onload, bounds, allowSkew = false) {
	let f = function(img) {
		let pd = pixelDataFromImage(img, bounds, allowSkew);

		onload(pd, img);
	};

	loadImageFromPath(path, f);
}

export function loadPixelDataFromPath(path, onload) {
	let f = function(img) {
		let pd = pixelDataFromImage(img);

		onload(pd, img);
	};

	loadImageFromPath(path, f);
}

export function loadImageFromPath(path, onload) {
	let img = new Image();

	//todo:listen for error?
	img.onload = function(event) {
		if(onload) {
			onload(img);
		}
	}

	img.src = path;
}
