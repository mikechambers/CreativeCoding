import Canvas from "./canvas.js"
import {createFileName, downloadJSON} from "./datautils.js"
import Rectangle from "./rectangle.js"
import Vector from "./vector.js"

class MeshJS {
	constructor() {
		//may eventually allow these to be set via config object
		this._pauseKey = " ";
		this._downloadPngKey = "p";
		this._downloadVideoKey = "v";
		this._initKey = "i";
		this._downloadConfigJson = "j";

		this._config;
		this._init;
		this._draw;

		this._fpsInterval;
		this._lastFrameTime;
		this._startTime;
		this._paused = false;

		this._canvas;
		this._frameCount = 0;
		this._trackMouse = false;

		this._mousePosition = undefined;

		this._canvasScaleX = 1;
		this._canvasScaleY = 1;
		this._canvasBoundingRect = undefined;
	}

	init(config, initCallback, drawCallback, promise){

		this._config = config;
		this._init = initCallback;
		this._draw = drawCallback;

		document.body.style.background = this._config.BACKGROUND_COLOR;

		//using arrow function so we can capture and pass correct this scope
		//window.addEventListener("keyup", (event) => { this.onKeyUp(event); });
		window.addEventListener("keyup", this.onKeyUp.bind(this));

		if(this._config.ANIMATE) {
			this._fpsInterval = 1000 / this._config.FPS;
			this._lastFrameTime = Date.now();
			this._startTime = this._lastFrameTime;
			window.requestAnimationFrame(this.onAnimationFrame.bind(this));
		}

		this._canvas = new Canvas(
			this._config.PARENT_ID,
			this._config.RENDER_WIDTH,
			this._config.RENDER_HEIGHT,
			this._config.CANVAS_BACKGROUND_COLOR);

		if(this._config.MAX_DISPLAY_WIDTH != this._config.RENDER_WIDTH ||
			this._config.MAX_DISPLAY_HEIGHT != this._config.RENDER_HEIGHT) {

			let maxW = this._config.MAX_DISPLAY_WIDTH;
			let maxH = this._config.MAX_DISPLAY_HEIGHT;

			let canvasW = this._config.RENDER_WIDTH;
			let canvasH = this._config.RENDER_HEIGHT;

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

			this._canvas.canvas.style.height = canvasH;
			this._canvas.canvas.style.width = canvasW;

			//note, we cache these for performance for mouse events.
			this._canvasBoundingRect = this._canvas.canvas.getBoundingClientRect();
			this._canvasScaleX = config.RENDER_WIDTH / canvasW;
			this._canvasScaleY = config.RENDER_HEIGHT / canvasH;
		}

		if(this._config.RECORD_VIDEO) {
			this._canvas.startRecord();
		}

		let f  = function() {
			this._init(this._canvas);

			if(!this._config.ANIMATE) {
				this.draw();
			}
		}.bind(this);

		//if a promise is passed in, we wont call init and draw until the
		//promise resolves
		if(promise) {
			promise.then(f, (err) => {console.log("mesh.init promise failed", err)});
		} else {
			f();
		}
	}

	get canvas() {
		return this._canvas;
	}
	draw() {
		this._frameCount++;
		this._draw(this._canvas, this._frameCount);
	}

	onMouseMove(event) {
		this._mousePosition.x = (
			event.clientX - this._canvasBoundingRect.left) * this._canvasScaleX;
		this._mousePosition.y = (
			event.clientY - this._canvasBoundingRect.top) * this._canvasScaleY;
	}

	_updateTrackMouse() {
		if(this._trackMouse) {
			if(!this._mousePosition) {
				this._mousePosition = new Vector();
			}
			this._canvas.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
		} else {
			this._mousePosition = undefined;
			this._canvas.canvas.removeEventListener("mousemove", this.onMouseMove);
		}
		//register / deregister for mouse event
		//store in global variable
		//pass to draw function? or make it a property on mesh?
		//mousePosition
		//window.addEventListener("keyup", this.onKeyUp.bind(this));
	}

	get mousePosition() {
		//todo: should we return a copy?
		return this._mousePosition;
	}

	set trackMouse(value) {
		if(this._trackMouse === value) {
			return;
		}

		this._trackMouse = value;

		this._updateTrackMouse();
	}

	get trackMouse() {
		return this._trackMouse;
	}

	setPaused(paused) {
		this._paused = paused;
		console.log(this._paused?"paused":"running");
	}

	onAnimationFrame() {
		let now = Date.now();
		let elapsed = now - this._lastFrameTime;

		if(elapsed > this._fpsInterval) {
			this._lastFrameTime = now - (elapsed % this._fpsInterval);

			if(this._draw && !this._paused) {
				if(this._config.CLEAR_CANVAS) {
					this._canvas.clear();
				}

				this.draw();
			}
		}

		window.requestAnimationFrame(this.onAnimationFrame.bind(this));
	}

	downloadPng() {
		let n = createFileName(this._config.APP_NAME, "png");
		this._canvas.downloadPNG(n);
	}

	downloadVideo() {
		let n = createFileName(this._config.APP_NAME, "webm");
		this._canvas.downloadVideo(n);
	}

	downloadJson() {
		downloadJSON(this._config, `${this._config.APP_NAME}_config`);
	}

	onKeyUp(event){

		const key = event.key;

		if(key === this._downloadPngKey) {
			this.downloadPng();
		} else if(key === this._downloadVideoKey) {
			this.downloadVideo();
		} else if(key === this._pauseKey) {
			this.setPaused(!this._paused);
		} else if(key === this._downloadConfigJson) {
			this.downloadJson();
		} else if (key === this._initKey) {
			this._init(this._canvas);
		}
	}
}

//todo: may want to make this static, so if we call from other modules we get
//same instance
let mesh;
export default mesh = new MeshJS();
