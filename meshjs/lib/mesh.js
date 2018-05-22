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

let _displayCanvas;
let _renderCanvas;

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

	_displayCanvas = new Canvas(
		_config.CANVAS_WIDTH,
		_config.CANVAS_HEIGHT,
		_config.PARENT_ID,
		_config.CANVAS_BACKGROUND_COLOR);

	if(!_config.RENDER_OFFSCREEN) {
		_renderCanvas = _displayCanvas;
	} else {
		_renderCanvas = new Canvas(
			_config.RENDER_WIDTH,
			_config.RENDER_HEIGHT,
			false, //dont attach to dom
			_config.CANVAS_BACKGROUND_COLOR);
	}

	if(_config.RECORD_VIDEO) {
		_renderCanvas.startRecord();
	}

	_init(_renderCanvas);

	if(!_config.ANIMATE) {
		draw();
	}
}

function draw() {

	//todo: should we pass in canvas here?
	_draw();

	//code to scale down canvas
	//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
	//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

	if(_config.RENDER_OFFSCREEN) {

		let maxW = _displayCanvas.bounds.width;
		let maxH = _displayCanvas.bounds.height;

		let canvasW = _renderCanvas.bounds.width;
		let canvasH = _renderCanvas.bounds.height;

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

		let offsetY = _displayCanvas.bounds.center.y - (canvasH / 2);
		let offsetX = _displayCanvas.bounds.center.x - (canvasW / 2);

		_displayCanvas.context.drawImage(
			_renderCanvas.canvas,
			offsetX, offsetY, canvasW, canvasH);
			//_displayCanvas.naturalWidth, _displayCanvas.naturalHeight
	}
}

const onAnimationFrame = function() {

	let now = Date.now();
	let elapsed = now - lastFrameTime;

	if(elapsed > fpsInterval) {
		lastFrameTime = now - (elapsed % fpsInterval);

		if(_draw && !_paused) {

			if(_config.CLEAR_CANVAS) {
				_renderCanvas.clear();
			}
			draw();
		}
	}

	window.requestAnimationFrame(onAnimationFrame);
}

const onKeyUp = function(event){
	const key = event.key;

	let n;
	if(key == "p") {
		n = createFileName(_config.APP_NAME, "png");
		_renderCanvas.downloadPNG(n);
	} else if(key == "v") {
		n = createFileName(_config.APP_NAME, "webm");
		_renderCanvas.downloadVideo(n);
	} else if(key == " ") {
		_paused = !_paused;
	} else if (key == "i") {
		_init(_renderCanvas);
	}
}
