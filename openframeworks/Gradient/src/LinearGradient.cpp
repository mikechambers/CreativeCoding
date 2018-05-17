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
    //float side = floor(sqrt((bounds.width * bounds.width) + (bounds.height * bounds.height)));
    //bounds.width = side;
    //bounds.height = side;
}

void LinearGradient::addStep(ofColor c1, float stopPosition) {
    float p = ofClamp(stopPosition, 0.0, 1.0);

    colorStops.insert(make_pair(p, c1));
}



void LinearGradient::render() {
    
    //float angle = 0.785398;
    float angle = 0;
    ofRectangle drawingBounds = getBoundingDimensions(angle);
    
    cout << drawingBounds.width << " : " << drawingBounds.height << endl;
    cout << bounds.width << " : " << bounds.height << endl;
    
    //drawingBounds.x -= drawingBounds.width - bounds.width;
    //drawingBounds.y -= drawingBounds.height - bounds.height;
    
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
    
    map<float, ofColor>::iterator it;
    
    ofColor startColor = tmpColorStops.begin()->second;

    float currentPosition = 0;
    ofPixels pixels;
    pixels.allocate(drawingBounds.width, drawingBounds.height, OF_IMAGE_COLOR_ALPHA);
    
    
    int index = 0;
    for ( it = tmpColorStops.begin(); it != tmpColorStops.end(); ++it) {
        
        if(index == 0) {
            index++;
            continue;
        }
        
        float nextPosition = it->first;
        ofColor nextColor = it->second;

        float _x = currentPosition * drawingBounds.width;
        
        ofRectangle section = ofRectangle(_x, 0, (nextPosition * drawingBounds.width) - _x, drawingBounds.height);
        
        int r;
        int g;
        int b;
        int a;
        
        float percent = 0;
        
        for(int i = 0; i < section.width; i++) {
            //percent = (i + 1) / section.width;
            
            percent = ofMap(i, 0, section.width, 0, 1);
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

            for(int j = 0; j < drawingBounds.height; j++) {
                pixels.setColor(section.x + i, j, ofColor(r, g, b, a));
            }
        }
        
        currentPosition = nextPosition;
        startColor = nextColor;
    }

    /*
    image.clear();
    image.allocate(drawingBounds.width, drawingBounds.height, OF_IMAGE_COLOR_ALPHA);
    image.setFromPixels(pixels);
    image.update();
    
    return;
     */
    
    ofPixels rotated;
    rotated.allocate(bounds.width, bounds.height, OF_IMAGE_COLOR_ALPHA);
    
    ofVec3f center = drawingBounds.getCenter();
    //center.y -= 200;
    //center.x += 200;
    
    for(int y = 0; y < bounds.height; y++) {
        for(int x = 0; x < bounds.width; x++) {
            
            //https://stackoverflow.com/a/695130
            
            float dx = x - center.x;
            float dy = y - center.y;
        
            //newX = cos(angle)*x - sin(angle)*y
            //newY = sin(angle)*x + cos(angle)*y

            float newX = cos(angle) * dx - sin(angle) * dy + center.x;
            float newY = cos(angle) * dy + sin(angle) * dx + center.y;
            
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

//move this to utils
ofVec3f LinearGradient::transformPoint(ofVec3f p, ofVec3f origin, float theta) {
    ofVec3f out;
    
    out.x = origin.x+(p.x-origin.x)*cos(theta)+(p.y-origin.y)*sin(theta);
    out.y = origin.y-(p.x-origin.x)*sin(theta)+(p.y-origin.y)*cos(theta);
    
    return out;
}

ofRectangle LinearGradient::getBoundingDimensions(float angle) {
    
    ofVec3f center = bounds.getCenter();
    
    ofVec3f mPoint = ofVec3f(ofGetMouseX(), ofGetMouseY());
    angle = -mGetAngleOfLine(center, mPoint);
    
    ofVec3f topLeftTransformPoint = transformPoint(
                                                   bounds.getTopLeft(),
                                                   center,
                                                   angle);
    
    ofVec3f topRightTransformPoint = transformPoint(
                                                    bounds.getTopRight(),
                                                    center,
                                                    angle);
    
    ofVec3f bottomRightTransformPoint = transformPoint(
                                                       bounds.getBottomRight(),
                                                       center,
                                                       angle);
    
    ofVec3f bottomLeftTransformPoint = transformPoint(
                                                      bounds.getBottomLeft(),
                                                      center,
                                                      angle);
    
    //https://stackoverflow.com/questions/622140/calculate-bounding-box-coordinates-from-a-rotated-rectangle
    float min_x = MIN(topLeftTransformPoint.x,topRightTransformPoint.x);
    min_x = MIN(min_x, bottomRightTransformPoint.x);
    min_x = MIN(min_x, bottomLeftTransformPoint.x);
    
    float min_y = MIN(topLeftTransformPoint.y,topRightTransformPoint.y);
    min_y = MIN(min_y, bottomRightTransformPoint.y);
    min_y = MIN(min_y, bottomLeftTransformPoint.y);
    
    float max_x = MAX(topLeftTransformPoint.x,topRightTransformPoint.x);
    max_x = MAX(max_x, bottomRightTransformPoint.x);
    max_x = MAX(max_x, bottomLeftTransformPoint.x);
    
    float max_y = MAX(topLeftTransformPoint.y,topRightTransformPoint.y);
    max_y = MAX(max_y, bottomRightTransformPoint.y);
    max_y = MAX(max_y, bottomLeftTransformPoint.y);
    
    //(min_x,min_y), (min_x,max_y), (max_x,max_y), (max_x,min_y)
    ofVec3f topLeftBoundsPoint = ofVec3f(min_x,min_y);
    ofVec3f topRightBoundsPoint = ofVec3f(max_x,min_y);
    ofVec3f bottomRightBoundsPoint = ofVec3f(max_x,max_y);
    ofVec3f bottomLeftBoundsPoint = ofVec3f(min_x,max_y);
    
    
    float width = topLeftBoundsPoint.distance(topRightBoundsPoint);
    float height = topLeftBoundsPoint.distance(bottomLeftBoundsPoint);
    
    ofRectangle out = ofRectangle(min_x, min_y, width, height);
    
    return out;
}


