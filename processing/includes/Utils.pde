void drawCircle(Point p, float radius) {
	ellipse(p.x, p.y, radius * 2, radius * 2);
}

void drawLine(Point p1, Point p2) {
	line(p1.x, p1.y, p2.x, p2.y);
}

Point getRandomPoint(int padding) {
	return new Point(random(padding, width - padding), random(padding, height - padding));
}

import java.awt.BasicStroke;
import java.awt.Graphics2D;
void strokeDash(float width) {

	BasicStroke pen;
	float[] dashes = { 2.0f};
	pen = new BasicStroke(width, BasicStroke.CAP_ROUND, BasicStroke.JOIN_MITER, 4.0f, dashes, 0.0f);

	Graphics2D g2 = ((PGraphicsJava2D) g).g2;
  	g2.setStroke(pen);
}

Point findPointOnQuadraticCurve(Point p1, Point p2, Point cp, float t) {
	//http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Quadratic_B.C3.A9zier_curves
	float x = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * cp.x + t * t * p2.x;
	float y = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * cp.y + t * t * p2.y;

	return new Point(x,y);
}
