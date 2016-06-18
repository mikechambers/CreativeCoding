#include "ImageLoader.h"


void ImageLoader::useMask(bool useMask){
    _useMask = useMask;
}

void ImageLoader::resize(int width, int height){
    
    if(_image.isAllocated()) {
        _image.resize(width, height);
    }
    
    if(_maskImage.isAllocated()) {
        _maskImage.resize(width, height);
    }
}

bool ImageLoader::load(string imagePath, string maskPath){
    if(!load(imagePath)) {
        cout << "ImageLoader error loading image : " + imagePath << endl;
        return false;
    }
    
    if(!_maskImage.load(maskPath)) {
        cout << "ImageLoader error loading mask : " + maskPath << endl;
        return false;
    }
    
    _useMask = true;
    return true;
}

bool ImageLoader::load(string imagePath){
    
    return _image.load(imagePath);
}

ofColor ImageLoader::getColor(ofVec3f p){
    return getColor(p.x, p.y);
}

void ImageLoader::setAlpha(int alpha) {
    _alpha = alpha;
    
    //not sure if we should set this here
    _nonMaskColor = ofColor(ofColor::white, _alpha);
}

void ImageLoader::setNonMaskColor(ofColor c) {
    _nonMaskColor = c;
}

ofColor ImageLoader::getColor(int x, int y){
    
    //if pixel is outside bounds, we return a completely transparent color
    //note, we only check image, and not mask (for performace). We assume they
    //have been resized or are same size
    //note, we dont all request for pixel at image.width / height as this causes a crash
    //sometimes
    if(x < 0 || x >= _image.getWidth() ||
       y < 0 || y >= _image.getHeight()) {
        return ofColor(ofColor::white, 0);
    }
    
    if(_maskImage.isAllocated()) {
        ofColor _mc = _maskImage.getColor(x, y);
        
        if(_mc != MASK_COLOR) {
            return _nonMaskColor;
        }
    }
    
    return ofColor(_image.getColor(x, y), _alpha);
}