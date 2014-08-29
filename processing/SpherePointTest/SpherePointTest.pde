
#include ../includes/Utils.pde

ArrayList points;
void setup() {
	size(500,500, OPENGL);
	float radius = 50;
	Point centerPoint = new Point(250, 250, 0);

	//float t = PI / 4;

	int len = 12;

	Point p;
	for(int i = 0; i < len; i++){
		float s = radians(90 / (i + 1));
		float t = PI / 4;
		p = plotPointOnSphere(centerPoint, radius, t, s);

		pushMatrix();
		translate(p.x, p.y, p.z);
		sphere(2);
		popMatrix();
	}

}

//r radius
//s angle of z radius
//t height angle
Point plotPointOnSphere(Point centerPoint, float r, float s, float t) {
	Point out = new Point();
	out.x = r * cos(s) * sin(t);
	out.y = r * sin(s) * sin(t);
	out.z = r * cos(t);

	out.x += centerPoint.x;
	out.y += centerPoint.y;
	out.z += centerPoint.z;

	return out;
}