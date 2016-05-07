#include "VectorUtils.h"


//this should probably pass in a pointer
ofVec3f meshCalculateDrag(Mover mover, float dragCoefficient) {
    float speed = mover.velocity.length();
    float dragMagnitude = dragCoefficient * speed * speed;
    ofVec3f drag = mover.velocity * -1;
    drag.normalize();
    drag *= dragMagnitude;
    return drag;
}

ofVec3f meshGetCenterPoint(ofRectangle bounds) {
    float x = bounds.x + (bounds.width / 2);
    float y = bounds.y + (bounds.height / 2);
    
    return ofVec3f(x, y, 0.0);
}

ofVec3f meshGetCenterPoint() {
    
    //could reuse api above, but this is faster
    return ofVec3f(ofGetWidth() / 2, ofGetHeight() / 2, 0.0);
}
