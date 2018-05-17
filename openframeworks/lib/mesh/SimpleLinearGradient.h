//
//  SimpleLinearGradient.h
//  SimpleLinearGradient
//
//  Created by Mike Chambers on 5/17/18.
//

#ifndef SimpleLinearGradient_h
#define SimpleLinearGradient_h

#include <stdio.h>
#include "ofMain.h"

#endif /* SimpleLinearGradient_h */

class SimpleLinearGradient {
public:
    SimpleLinearGradient() = default;
    SimpleLinearGradient(ofColor startColor, ofColor endColor);

    void setBounds(ofRectangle bounds);
    void render();
    void draw();
    ofColor getColor(ofVec3f p);
    ofColor getColor(int x, int y);
    
    
private:
    ofRectangle _bounds;
    ofColor _startColor;
    ofColor _endColor;
    ofImage _gradient;
    
    bool _hasRendered = false;
    
    float cosInterpolate(float a, float b, float px);
};
