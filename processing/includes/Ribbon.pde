class Ribbon {


	Boolean useFill = true;
	int strokeColor = 0xFF000000;
	float fillAlpha = 1.0;
	Boolean animateRibbon = false;
	int maxRibbonLength = 20;
	ColorThemeManager theme = null;

	ArrayList<RibbonSegment> segments;
	Ribbon () {
		segments = new ArrayList<RibbonSegment>();
	}

	Ribbon (ColorThemeManager theme) {
		this();
		this.theme = theme;
	}

	void render() {
		stroke(strokeColor);
		
		noFill();

		for (RibbonSegment segment : segments) {

			QuadraticCurve c = segment.curve;

			if(useFill) {
				fill(
						setAlphaOfColor(segment.segmentColor, fillAlpha)
					);
			}

			QuadraticCurve topCurve = new QuadraticCurve();
			QuadraticCurve bottomCurve = new QuadraticCurve();

			float angle = getAngleOfLine(c.p1, c.p2);
			//todo: fix this.
			angle = 0.0;
			topCurve.p1 = getPointOnCircle(c.p1, 20,  HALF_PI + angle);
			topCurve.p2 = getPointOnCircle(c.p2, 20,  HALF_PI + angle);
			topCurve.cp = getPointOnCircle(c.cp, 20,  HALF_PI + angle);

			bottomCurve.p1 = getPointOnCircle(c.p1, 20,  ((3 * PI)/2) + angle);
			bottomCurve.p2 = getPointOnCircle(c.p2, 20,  ((3 * PI)/2) + angle);
			bottomCurve.cp = getPointOnCircle(c.cp, 20,  ((3 * PI)/2) + angle);


			beginShape();
			strokeWeight(1.0);
			//vertex(c.p1.x, c.p1.y);
			//quadraticVertex(c.cp.x, c.cp.y, c.p2.x, c.p2.y);

			vertex(topCurve.p1.x, topCurve.p1.y);
			quadraticVertex(topCurve.cp.x, topCurve.cp.y, topCurve.p2.x, topCurve.p2.y);

			vertex(bottomCurve.p2.x, bottomCurve.p2.y);
			quadraticVertex(bottomCurve.cp.x, bottomCurve.cp.y, bottomCurve.p1.x, bottomCurve.p1.y);
			vertex(topCurve.p1.x, topCurve.p1.y);

			if(useFill) {
				endShape(CLOSE);
			} else {
				endShape();
			}
		}
	}

	Point _lastCp = null;
	void addControlPoint (Point cp) {
		//see if we are already constructing a curve
		if(_lastCp == null) {
			_lastCp = cp;
			return;
		}

		QuadraticCurve currentCurve = new QuadraticCurve();

		currentCurve.cp = _lastCp;

		if(segments.size() > 0) {
			QuadraticCurve _tmp = segments.get(segments.size() - 1).curve;
			currentCurve.p1 = _tmp.p2;
		} else {
			currentCurve.p1 = getCenterPointOfLine(_lastCp, cp);
		}

		currentCurve.p2 = getCenterPointOfLine(_lastCp, cp);

		//todo: this will barf if we dont set a theme
		segments.add(new RibbonSegment(currentCurve, theme.getNextColor()));

		_lastCp = cp;

		if(animateRibbon && segments.size() > maxRibbonLength) {
			segments.remove(0);
		}
	}
}

class RibbonSegment {

	QuadraticCurve curve;
	int segmentColor;

	RibbonSegment(QuadraticCurve _curve, int _color) {
		curve = _curve;
		segmentColor = _color;
	}
}