//
//  SimpleLinearGradient.cpp
//  SimpleLinearGradient
//
//  Created by Mike Chambers on 5/17/18.
//

#include "SimpleLinearGradient.h"

SimpleLinearGradient::SimpleLinearGradient(ofColor startColor, ofColor endColor) {
    _startColor = startColor;
    _endColor = endColor;
    
    _hasRendered = false;
}

void SimpleLinearGradient::setBounds(ofRectangle bounds) {
    _bounds = bounds;
}

void SimpleLinearGradient::render() {

    int w = _bounds.width;
    int h = _bounds.height;
    
    ofPixels pixels;
    pixels.allocate(w, h, OF_IMAGE_COLOR_ALPHA);
    
    for(int x = 0; x < w; x++) {
        int r = 0;
        int g = 0;
        int b = 0;
        int a = 0;
        
        float percent = ofMap(x, 0, w, 0, 1);
        
        r  = floor(sqrt(cosInterpolate((_startColor.r * _startColor.r),(_endColor.r * _endColor.r), percent)));
        g  = floor(sqrt(cosInterpolate((_startColor.g * _startColor.g), (_endColor.g * _endColor.g), percent)));
        b  = floor(sqrt(cosInterpolate((_startColor.b * _startColor.b), (_endColor.b * _endColor.b), percent)));
        a  = floor(sqrt(cosInterpolate((_startColor.a * _startColor.a), (_endColor.a * _endColor.a), percent)));
        
        ofColor color = ofColor(r, g, b, a);
        
        for(int y = 0;  y < h; y++) {
            pixels.setColor(x, y, color);
        }
    }
    
    _gradient.clear();
    _gradient.allocate(w, h, OF_IMAGE_COLOR_ALPHA);
    _gradient.setFromPixels(pixels);
    _gradient.update();
    
    _hasRendered = true;
}

void SimpleLinearGradient::draw() {
    
    if(!_hasRendered) {
        render();
    }
    
    _gradient.draw(_bounds.x, _bounds.y);
}

ofColor SimpleLinearGradient::getColor(ofVec3f p) {
    return getColor(p.x, p.y);
}

ofColor SimpleLinearGradient::getColor(int x, int y) {
    return _gradient.getColor(x, y);
}

float SimpleLinearGradient::cosInterpolate(float a, float b, float px) {
    float ft = px * M_PI;
    float  f = (1 - cos(ft)) * 0.5;
    return  a * (1 - f) + b * f;
}

