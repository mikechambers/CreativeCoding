//
//  Canvas.h
//  PerlinPlayRender
//
//  Created by Mike Chambers on 4/23/18.
//

#ifndef Canvas_h
#define Canvas_h

#include <stdio.h>
#include "ofMain.h"

class Canvas : public ofFbo {
public:
    float height = 0;
    float width = 0;
    
    void allocate(ofRectangle _bounds, ofColor backgroundColor, int internalformat = GL_RGBA);
    void reset();
    void draw(ofRectangle targetBounds);
    void saveImage(string path);
    
private:
    ofRectangle bounds;
    ofColor backgroundColor;
    int glFormat = GL_RGBA;
};



#endif /* Canvas_h */
