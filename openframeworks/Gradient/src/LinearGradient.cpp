//
//  Gradient.cpp
//  Gradient
//
//  Created by Mike Chambers on 4/15/18.
//

#include "LinearGradient.h"


void LinearGradient::setOrientation(GRADIENT_ORIENTATION _orientation) {
    orientation = _orientation;
}

void LinearGradient::setMode(GRADIENT_MODE _mode) {
    mode = _mode;
}

void LinearGradient::setBounds(const ofRectangle & _bounds) {
    bounds = _bounds;
}

void LinearGradient::addStep(ofColor c1, float stopPosition) {
    float p = ofClamp(stopPosition, 0.0, 1.0);

    colorStops.insert(make_pair(p, c1));
}

void LinearGradient::render() {
    image.clear();
    image.allocate(bounds.width, bounds.height, OF_IMAGE_COLOR_ALPHA);
    
    map<float, ofColor> tmpColorStops;
    tmpColorStops.insert(colorStops.begin(), colorStops.end());
    
    if(tmpColorStops.begin()->first != 0.0) {
        tmpColorStops.insert(make_pair(0.0, colorStops.begin()->second));
    }
    
    map<float, ofColor>::iterator itr;
    itr = tmpColorStops.end();
    --itr;
    if(itr->first != 1.0) {
        tmpColorStops.insert(make_pair(1.0, itr->second));
    }
    
    map<float,ofColor>::iterator it;
    
    ofColor startColor = tmpColorStops.begin()->second;

    float currentPosition = 0;
    
    int index = 0;
    for ( it = tmpColorStops.begin(); it != tmpColorStops.end(); ++it) {
        cout << "key : " << it->first << endl;
        
        /*
        float nextPosition = it->first;
        if(nextPosition == 0.0) {
            continue;
        }
         */
        
        if(index == 0) {
            index++;
            continue;
        }
        
        float nextPosition = it->first;
        ofColor nextColor = it->second;
        
        //int x = currentPosition * bounds.width;
        
        //float w = x + ((nextPosition * bounds.width) - (currentPosition * bounds.width));
        
        ofRectangle section = ofRectangle(currentPosition * bounds.width, 0, (nextPosition * bounds.width) - (currentPosition * bounds.width), bounds.height);
        
        int r;
        int g;
        int b;
        int a;
        
        float percent = 0;
        
        //while(x < w) {
        for(int i = 0; i < section.width; i++) {
            //percent = x / w;
            percent = i / section.width;

            switch(mode) {
                case COS_SQUARED:
                    r  = floor(sqrt(
                                    interpolate(
                                                (startColor.r * startColor.r),
                                                (nextColor.r * nextColor.r),
                                                percent
                                                )
                                    )
                               );
                    g  = floor(sqrt(interpolate((startColor.g * startColor.g), (nextColor.g * nextColor.g), percent)));
                    b  = floor(sqrt(interpolate((startColor.b * startColor.b), (nextColor.b * nextColor.b), percent)));
                    a  = floor(sqrt(interpolate((startColor.a * startColor.a), (nextColor.a * nextColor.a), percent)));
                    break;
                case LINEAR_SQUARED:
                    r  = floor(sqrt((startColor.r * startColor.r) * (1 - percent) + (nextColor.r * nextColor.r) * percent));
                    g  = floor(sqrt((startColor.g * startColor.g) * (1 - percent) + (nextColor.g * nextColor.g) * percent));
                    b  = floor(sqrt((startColor.b * startColor.b) * (1 - percent) + (nextColor.b * nextColor.b) * percent));
                    a  = floor(sqrt((startColor.a * startColor.a) * (1 - percent) + (nextColor.a * nextColor.a) * percent));
                    break;
                case COS_NOT_SQUARED:
                    r  = floor((interpolate((startColor.r), (nextColor.r), percent)));
                    g  = floor((interpolate((startColor.g), (nextColor.g), percent)));
                    b  = floor((interpolate((startColor.b), (nextColor.b), percent)));
                    a  = floor((interpolate((startColor.a), (nextColor.a), percent)));
                    break;
                case LINEAR_NOT_SQUARED:
                    r  = floor((startColor.r * (1 - percent) + nextColor.r * percent));
                    g = floor((startColor.g * (1 - percent) + nextColor.g * percent));
                    b = floor((startColor.b * (1 - percent) + nextColor.b * percent));
                    a = floor((startColor.a * (1 - percent) + nextColor.a * percent));
                    break;
            }

            for(int j = 0; j < bounds.height; j++) {
                image.setColor(section.x + i, j, ofColor(r,g, b, a));
            }
            //x++;
        }
        
        currentPosition = nextPosition;
        startColor = nextColor;
    }
    
    image.update();
}

float LinearGradient::interpolate(float a, float b, float px) {
    float ft = px * M_PI;
    float  f = (1 - cos(ft)) * 0.5;
        return  a * (1 - f) + b * f;
}

void LinearGradient::draw() {
    image.draw(bounds.x, bounds.y);
}
