//
//  Swatch.h
//  ColorP
//
//  Created by Mike Chambers on 4/25/18.
//

#ifndef Swatch_h
#define Swatch_h

#include <stdio.h>
#include "ofMain.h"
#include "TweenMover.h"

class Swatch : public TweenMover {

public:

    ofColor color;
    float width = 50;
    float height = 50;

    Swatch();
    Swatch(ofColor _color);
    
    void setDimensions(float _height, float _width);
};

#endif /* Swatch_h */
