//
//  Swatch.cpp
//  ColorP
//
//  Created by Mike Chambers on 4/25/18.
//

#include "Swatch.h"
#include "ofxEasing.h"

Swatch::Swatch() {
    color = ofColor(0,0,0,255);
}

Swatch::Swatch(ofColor _color) {
    _color = color;
}

void Swatch::setDimensions(float _height, float _width) {
    height = _height;
    width = _width;
}
