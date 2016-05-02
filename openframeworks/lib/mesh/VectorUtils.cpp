#include "VectorUtils.h"


//this should probably pass in a pointer
ofVec3f VectorUtils::calculateDrag(Mover mover, float dragCoefficient) {
    float speed = mover.velocity.length();
    float dragMagnitude = dragCoefficient * speed * speed;
    ofVec3f drag = mover.velocity * -1;
    drag.normalize();
    drag *= dragMagnitude;
    return drag;
}