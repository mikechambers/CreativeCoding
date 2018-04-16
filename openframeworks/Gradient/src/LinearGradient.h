//
//  Gradient.hpp
//  Gradient
//
//  Created by Mike Chambers on 4/15/18.
//

#ifndef Gradient_hpp
#define Gradient_hpp

#include <stdio.h>
#include "ofMain.h"

enum GRADIENT_ORIENTATION { LEFT_TO_RIGHT };
enum GRADIENT_MODE { LINEAR_SQUARED, COS_SQUARED, LINEAR_NOT_SQUARED, COS_NOT_SQUARED };

class LinearGradient {
    
private:
    //char _screenshotKey = 's';
    //string _name;
    
    ofRectangle bounds;
    GRADIENT_ORIENTATION orientation = LEFT_TO_RIGHT;
    GRADIENT_MODE mode = COS_SQUARED;
    
    map<float, ofColor> colorStops;
    ofImage image;
    float interpolate(float a, float b, float px);
    
public:
    void setBounds(const ofRectangle & bounds);
    void addStep(ofColor c1, float stop);
    void setOrientation(GRADIENT_ORIENTATION _orientation);
    void setMode(GRADIENT_MODE _mode);
    void render();
    void draw();
    
    //void draw();
    //void getPixels();
    
    //void setOrientationAngle();
};

#endif /* Gradient_hpp */
