void drawCircle(Point p, float radius) {
	ellipse(p.x, p.y, radius * 2, radius * 2);
}

void drawLine(Point p1, Point p2) {
	line(p1.x, p1.y, p2.x, p2.y);
}

Point getRandomPoint(int padding) {
	return new Point(random(padding, width - padding), random(padding, height - padding));
}
