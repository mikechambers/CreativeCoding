//
//  Canvas.cpp
//  PerlinPlayRender
//
//  Created by Mike Chambers on 4/23/18.
//

#include "Canvas.h"

void Canvas::allocate(ofRectangle _bounds,  ofColor _backgroundColor) {
    bounds = _bounds;
    height = bounds.height;
    width = bounds.width;
    backgroundColor = _backgroundColor;
    
    ofFbo::allocate(bounds.width, bounds.height, GL_RGBA);
    
    begin();
    ofClear(backgroundColor);
    end();
}

void Canvas::reset() {
    clear();
    allocate(bounds, backgroundColor);
}

void Canvas::draw(ofRectangle targetBounds) {
    
    /*
    //store these when allocate is called;
    float h = getHeight();
    float w = getWidth();
    
    float tW = targetBounds.height;
    float tH = (tW * h) / w;
    
    float offset = targetBounds.getCenter().y - (tH / 2);
    */
    
    float maxW = targetBounds.width;
    float maxH = targetBounds.height;
    
    float canvasW = bounds.width;
    float canvasH = bounds.height;
    
    if (canvasH > maxH || canvasW > maxW) {
        float ratio = canvasH / canvasW;

        if (canvasW >= maxW && ratio <= 1) {
            canvasW = maxW;
            canvasH = canvasW * ratio;
        } else if (canvasH >= maxH) {
            canvasH = maxH;
            canvasW = canvasH / ratio;
        }
    }
  
    float offset = targetBounds.getCenter().y - (canvasH / 2);
    
    ofFbo::draw(0, offset, canvasW, canvasH);
}

void Canvas::saveImage(string name) {
    ofPixels pixels;
    readToPixels(pixels);
    string n = "../../../screenshots/" + name + "_" + ofGetTimestampString() + ".png";
    
    cout << "Saving FBO Render : " << n << endl;
    ofSaveImage(pixels, n);
}
