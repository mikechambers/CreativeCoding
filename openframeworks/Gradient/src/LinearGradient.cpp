//
//  Gradient.cpp
//  Gradient
//
//  Created by Mike Chambers on 4/15/18.
//

#include "LinearGradient.h"
#include "MeshUtils.h"


void LinearGradient::setOrientation(GRADIENT_ORIENTATION _orientation) {
    orientation = _orientation;
}

void LinearGradient::setMode(GRADIENT_MODE _mode) {
    mode = _mode;
}

void LinearGradient::setBounds(const ofRectangle & _bounds) {
    

    bounds = _bounds;
    float side = floor(sqrt((bounds.width * bounds.width) + (bounds.height * bounds.height)));
    bounds.width = side;
    bounds.height = side;
}

void LinearGradient::addStep(ofColor c1, float stopPosition) {
    float p = ofClamp(stopPosition, 0.0, 1.0);

    colorStops.insert(make_pair(p, c1));
}


void LinearGradient::render() {
    
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
    ofPixels pixels;
    pixels.allocate(bounds.width, bounds.height, OF_IMAGE_COLOR_ALPHA);
    
    
    int index = 0;
    for ( it = tmpColorStops.begin(); it != tmpColorStops.end(); ++it) {
        
        if(index == 0) {
            index++;
            continue;
        }
        
        float nextPosition = it->first;
        ofColor nextColor = it->second;

        float _x = currentPosition * bounds.width;
        ofRectangle section = ofRectangle(_x, 0, (nextPosition * bounds.width) - _x, bounds.height);
        
        int r;
        int g;
        int b;
        int a;
        
        float percent = 0;
        
        for(int i = 0; i < section.width; i++) {
            percent = i / section.width;

            switch(mode) {
                case COS_SQUARED:
                    r  = floor(sqrt(interpolate((startColor.r * startColor.r),(nextColor.r * nextColor.r),percent)));
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
                pixels.setColor(section.x + i, j, ofColor(r, g, b, a));
            }
        }
        
        currentPosition = nextPosition;
        startColor = nextColor;
    }

    
    ofPixels rotated;
    rotated.allocate(bounds.width, bounds.height, OF_IMAGE_COLOR_ALPHA);
    
    ofVec3f center = bounds.getCenter();
    
    /*
     for each pixel in input:
     {
     p2 = rotate(pixel, -angle);
     value = interpolate(input, p2)
     
     output(pixel) = value
     }
     */
    
    ofRectangle outRect = ofRectangle(0, 0, 1280, 1280);
    
    ofVec3f outCenter = outRect.getCenter();
    //outCenter = center;

    float angle = 0.785398;
    for(int y = 0; y < outRect.height; y++) {
        for(int x = 0; x < outRect.width; x++) {
            
            //https://stackoverflow.com/a/695130
            angle = angle;
            
            float dx = x - center.x;
            float dy = y - center.y;
            
            float newX = cos(-angle) * dx - sin(-angle) * dy + (center.x);
            float newY = cos(-angle) * dy + sin(-angle) * dx + center.y;

            //rotated.setColor(newX, newY, pixels.getColor(x, y));
            
            rotated.setColor(x, y, pixels.getColor(newX, newY));            
        }
    }
    
    /*
    for (int y = 0; y < SIZEY; y++) {
        for (int x = 0; x < SIZEX; x++) {
            double dx = ((double)x)-centerX;
            double dy = ((double)y)-centerY;
            double newX = cos(angle)*dx-sin(angle)*dy+centerX;
            double newY = cos(angle)*dy+sin(angle)*dx+centerY;
            
            int ix = (int) round(newX);
            int iy = (int) round(newY);
            target[x][y] = source[ix][iy];
        }
    }
    */
    
    image.clear();
    image.allocate(bounds.width, bounds.height, OF_IMAGE_COLOR_ALPHA);
    image.setFromPixels(rotated);
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

ofImage LinearGradient::getImage() {
    return image;
}


