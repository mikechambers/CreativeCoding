class InvaderFactory {

	int columnCount = 5;
	int rowCount = 5;
	float pixelWidth = 5;
	float pixelHeight = 5;
	int fillColor = 0xFF000000;
	Boolean allowDuplicates = false;

	//HashMap hashes<String, Boolean>;

	InvaderFactory (int columnCount, int rowCount, float width, float height, Boolean allowDuplicates) {
		this.columnCount = columnCount;
		this.rowCount = rowCount;

		pixelWidth = width / columnCount;
		pixelHeight = height / rowCount;

		this.allowDuplicates = allowDuplicates;

		if(!this.allowDuplicates) {
			//hashes = new HashMap<String, Boolean>();
		}
	}

	void generate() {

		float width = pixelWidth;
		float height = pixelHeight;

		int totalCols = columnCount;
		int halfCols = ceil(float(totalCols) / 2);
		int rows = rowCount;

		char[] slots = new char[totalCols * rows];
		char fillChar;
	
		for(int i = 0; i < halfCols; i++) {
			for(int k = 0; k < rows; k++) {
				fillChar = '0';
				noStroke();
				noFill();
				if(random(1) > 0.5) {
					fillChar = '1';
					fill(fillColor);
				}

				slots[int(i + (k * totalCols))] = fillChar;
				//return pixels[floor(point.x) + (floor(point.y) * img.width)];
				rect(width * i, height * k, width, height);

				if(i < halfCols - 1) {
					slots[int((totalCols - i - 1) + (k * totalCols))] = fillChar;
					rect(width * (totalCols - i - 1), height * k, width, height);
				}
			}
		}

		println(new String(slots));
	}

}