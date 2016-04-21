#ifndef ImageLoader_hpp
#define ImageLoader_hpp

#include <stdio.h>
#include "ofMain.h"

class ImageLoader {
    
private:
    ofImage _image;
    ofImage _maskImage;
    bool _useMask = false;
    int _alpha = 255;
    
    //this is what color is returned if a pixel is requested from a nonmasked area.
    ofColor _nonMaskColor = ofColor(ofColor::white, 0.0);
    
    ofColor const MASK_COLOR = ofColor(0,0,0);
    
public:
    
    void setAlpha(int alpha);
    void useMask(bool _useMask);
    void resize(int width, int height);
    bool load(string imagePath, string maskPath);
    bool load(string imagePath);
    ofColor getColor(ofVec3f p);
    ofColor getColor(int x, int y);
    void setNonMaskColor(ofColor c);
    
    
};

#endif /* ImageLoader_hpp */