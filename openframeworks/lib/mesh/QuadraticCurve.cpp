#include "QuadraticCurve.h"



QuadraticCurve::QuadraticCurve() {
    
}

QuadraticCurve::QuadraticCurve(ofVec3f p1, ofVec3f p2, ofVec3f cp) {
    this->p1 = p1;
    this->p2 = p2;
    this->cp = cp;
}