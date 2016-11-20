/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */
/*global atob, btoa, ArrayBuffer, Uint8Array, Blob */

class Grid {
	constructor(bounds, cellWidth, cellHeight, padding = 0) {
		this.renderers = [];
		this.renderIndex = 0;

		this.bounds = bounds;
		this.cellWidth = cellWidth;
		this.cellHeight = cellHeight;
		this.padding = padding;

		this.random = false;
	}

	render(bounds = this.bounds, cellWidth = this.cellWidth, cellHeight = this.cellHeight, padding = this.padding) {
		let rectangle = bounds;

        let colCount = Math.floor((rectangle.width - padding) / (cellWidth + padding));
        let rowCount =  Math.floor((rectangle.height - padding) / (cellHeight + padding));

        let colOffset = ((rectangle.width - colCount * (cellWidth + padding) - padding) / 2);
        let rowOffset = ((rectangle.height - rowCount * (cellHeight + padding) - padding) / 2);

        let size = new Size(cellWidth, cellHeight);

        for(let i = 0; i < rowCount; i++) {
            for(let k = 0; k < colCount; k++) {

                var _x = rectangle.x + ((k * cellWidth ) + (padding * (k + 1))) + colOffset; 
                var _y = rectangle.y + ((i * cellHeight) + (padding * (i + 1))) + rowOffset; 

                var r = new Rectangle(new Point(_x, _y), size);

                let f = this.getNextRenderer();
                f(r, cellWidth, cellHeight, padding);


                //createGrid(r, width / 2, height / 2, 2);
            }
        }
	}

	getNextRenderer () {
		if(this.random) {
			this.renderIndex = Math.floor(Math.random() * this.renderers.length);
		} else {

			this.renderIndex++;

			if(this.renderIndex == this.renderers.length) {
				this.renderIndex = 0;
			}
		}

		return this.renderers[this.renderIndex];
	}

	addRenderer (f) {
		if(!f) {
			return;
		}

		this.renderers.push(f);
	}


}