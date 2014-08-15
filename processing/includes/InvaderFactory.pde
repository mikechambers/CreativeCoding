import java.util.HashMap;

class InvaderFactory {

	int columnCount = 5;
	int rowCount = 5;
	float pixelWidth = 5;
	float pixelHeight = 5;
	int fillColor = 0xFF000000;
	Boolean allowDuplicates = false;
	int maxUniqueCombinations = 0;

	HashMap hashes;

	InvaderFactory (int columnCount, int rowCount, float width, float height, Boolean allowDuplicates) {
		this.columnCount = columnCount;
		this.rowCount = rowCount;




		pixelWidth = width / columnCount;
		pixelHeight = height / rowCount;

		this.allowDuplicates = allowDuplicates;

		int totalUniqueCells = ceil(float(this.columnCount) / 2) * rowCount;
		maxUniqueCombinations = int(pow(2, totalUniqueCells));
		

		if(!this.allowDuplicates) {
			hashes = new HashMap();
		}
	}

	int dupeFound = 0;
	Invader generate() {
		Invader invader = null;

		while(true) {
			invader = _generate();
			
			if(allowDuplicates) {
				return invader;
			}

			//Object exists = hashes.get(invader.hash);

			if(!hashes.containsKey(invader.hash)) {
				hashes.put(invader.hash, invader);
				return invader;
			}

			dupeFound++;
			println(dupeFound);
		}	

	}

	Invader _generate() {

		float width = pixelWidth;
		float height = pixelHeight;

		int totalCols = columnCount;
		int halfCols = ceil(float(totalCols) / 2);
		int rows = rowCount;

		char[] slots = new char[totalCols * rows];
		char fillChar;
		
		PShape invader = createShape(GROUP);
		//noStroke();

		Boolean doFill = false;
		for(int i = 0; i < halfCols; i++) {
			for(int k = 0; k < rows; k++) {
				fillChar = '0';


				doFill = (random(1) > 0.5);

				slots[int(i + (k * totalCols))] = fillChar;

				PShape _tmp = createShape(RECT, width * i, height * k, width, height);

				if(doFill) {
					fillChar = '1';
					_tmp.setFill(fillColor);
				} else {
					_tmp.setFill(false);
				}

				invader.addChild(_tmp);

				if(i < halfCols - 1) {
					slots[int((totalCols - i - 1) + (k * totalCols))] = fillChar;
					_tmp = createShape(RECT, width * (totalCols - i - 1), height * k, width, height);


					if(doFill) {
						_tmp.setFill(fillColor);
					} else {
						_tmp.setFill(false);
					}

					invader.addChild(_tmp);
				}
			}
		}

		return new Invader(invader, new String(slots));
	}	
}

class Invader {
	PShape shape;
	String hash;
	Invader(PShape shape, String hash) {
		this.shape = shape;
		this.hash = hash;
	}
}
