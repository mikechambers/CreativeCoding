#ifndef QuadraticCurve_hpp
#define QuadraticCurve_hpp

#include <stdio.h>
#include "ofMain.h"


class QuadraticCurve {
    
private:

    
public:
    ofVec3f p1;
    ofVec3f p2;
    ofVec3f cp;
    
    QuadraticCurve();
    QuadraticCurve(ofVec3f p1, ofVec3f p2, ofVec3f cp);
};



#endif /* QuadraticCurve_hpp */


/*
class QuadraticCurve {
    
    Point p1 = null;
    Point p2 = null;
    Point cp = null;
    QuadraticCurve (Point _p1, Point _p2, Point _cp) {
        p1 = _p1;
        p2 = _p2;
        cp = _cp;
    }
    
    QuadraticCurve () {
    }
}
*/