import Canvas from "./canvas.js"
import {createFileName} from "./datautils.js"
import Rectangle from "./rectangle.js"

//expose a single canvas, which is the fbo, and then we update the display canvas
//after we call drawImage
//if we dont animate, we make sure to call draw at least once after _init
//if both canvas sizes are the same, then we just draw to a single canvas_container
//when saving screenshots, we capture from Facebook
//when capturing video, we capture from screen (maybe)

let _config;
let _init;
let _draw;

let fpsInterval;
let lastFrameTime;
let startTime;
let _paused = false;

//right now only supports creating one canvas
let canvas;

export function init(config, init, draw){

	_config = config;
	_init = init;
	_draw = draw;

	document.body.style.background = _config.BACKGROUND_COLOR;

	window.addEventListener("keyup", onKeyUp);

	if(_config.ANIMATE) {
		fpsInterval = 1000 / config.FPS;
		lastFrameTime = Date.now();
		startTime = lastFrameTime;
		window.requestAnimationFrame(onAnimationFrame);
	}

	canvas = new Canvas(_config.CANVAS_ID,
		config.CANVAS_HEIGHT,
		config.CANVAS_WIDTH,
		config.CANVAS_BACKGROUND_COLOR);

	if(_config.RECORD_VIDEO) {
		canvas.startRecord();
	}

	_init(canvas);
}

const onAnimationFrame = function() {

	let now = Date.now();
	let elapsed = now - lastFrameTime;

	if(elapsed > fpsInterval) {
		lastFrameTime = now - (elapsed % fpsInterval);

		if(_draw && !_paused) {

			if(_config.CLEAR_CANVAS) {
				canvas.clear();
			}
			_draw();
		}
	}

	window.requestAnimationFrame(onAnimationFrame);
}

const onKeyUp = function(event){
	const key = event.key;

	let n;
	if(key == "p") {
		n = createFileName(_config.APP_NAME, "png");
		canvas.downloadPNG(n);
	} else if(key == "v") {
		n = createFileName(_config.APP_NAME, "webm");
		canvas.downloadVideo(n);
	} else if(key == " ") {
		_paused = !_paused;
	} else if (key == "i") {
		_init(canvas);
	}
}
