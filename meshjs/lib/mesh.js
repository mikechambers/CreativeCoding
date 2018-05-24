import Canvas from "./canvas.js"
import {createFileName} from "./datautils.js"
import Rectangle from "./rectangle.js"

//may eventually allow these to be set via config object
let _pauseKey = " ";
let _downloadPngKey = "p";
let _downloadVideoKey = "v";
let _initKey = "i";

let _config;
let _init;
let _draw;

let fpsInterval;
let lastFrameTime;
let startTime;
let _paused = false;

let _canvas;
let _frameCount = 0;

export function init(config, initCallback, drawCallback){

	_config = config;
	_init = initCallback;
	_draw = drawCallback;

	document.body.style.background = _config.BACKGROUND_COLOR;

	window.addEventListener("keyup", onKeyUp);

	if(_config.ANIMATE) {
		fpsInterval = 1000 / config.FPS;
		lastFrameTime = Date.now();
		startTime = lastFrameTime;
		window.requestAnimationFrame(onAnimationFrame);
	}

	_canvas = new Canvas(
		_config.PARENT_ID,
		_config.RENDER_WIDTH,
		_config.RENDER_HEIGHT,
		_config.CANVAS_BACKGROUND_COLOR);

	if(_config.MAX_DISPLAY_WIDTH != _config.RENDER_WIDTH ||
		_config.MAX_DISPLAY_HEIGHT != _config.RENDER_HEIGHT) {

		let maxW = _config.MAX_DISPLAY_WIDTH;
		let maxH = _config.MAX_DISPLAY_HEIGHT;

		let canvasW = _config.RENDER_WIDTH;
		let canvasH = _config.RENDER_HEIGHT;

		if (canvasH > maxH || canvasW > maxW) {
			let ratio = canvasH / canvasW;

			if (canvasW >= maxW && ratio <= 1) {
				canvasW = maxW;
				canvasH = canvasW * ratio;
			} else if (canvasH >= maxH) {
				canvasH = maxH;
				canvasW = canvasH / ratio;
			}
		}

		_canvas.canvas.style.height = canvasH;
		_canvas.canvas.style.width = canvasW;
	}

	if(_config.RECORD_VIDEO) {
		_canvas.startRecord();
	}

	_init(_canvas);

	if(!_config.ANIMATE) {
		draw();
	}
}

function draw() {
	_frameCount++;
	_draw(_canvas, _frameCount);
}

export function setPaused(paused) {
	_paused = paused;
	console.log(_paused?"paused":"resumed");
}

const onAnimationFrame = function() {
	let now = Date.now();
	let elapsed = now - lastFrameTime;

	if(elapsed > fpsInterval) {
		lastFrameTime = now - (elapsed % fpsInterval);

		if(_draw && !_paused) {
			if(_config.CLEAR_CANVAS) {
				_canvas.clear();
			}
			draw();
		}
	}

	window.requestAnimationFrame(onAnimationFrame);
}

export function downloadPng() {
	let n = createFileName(_config.APP_NAME, "png");
	_canvas.downloadPNG(n);
}

export function downloadVideo() {
	let n = createFileName(_config.APP_NAME, "webm");
	_canvas.downloadVideo(n);
}

const onKeyUp = function(event){
	const key = event.key;

	if(key === _downloadPngKey) {
		downloadPng();
	} else if(key === _downloadVideoKey) {
		downloadVideo();
	} else if(key === _pauseKey) {
		setPaused(!_paused);
	} else if (key === _initKey) {
		_init(_canvas);
	}
}
