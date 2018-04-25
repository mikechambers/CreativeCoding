//
//  ColorPalette.h
//  PerlinPlayRender
//
//  Created by Mike Chambers on 4/23/18.
//

#ifndef ColorPalette_h
#define ColorPalette_h

#include <stdio.h>
#include "ofMain.h"

class ColorPalette {

public:
    vector<ofColor> getColors();
    void setColors(vector<ofColor> colors);
    ofColor getRandomColor();
    ofColor getNextColor();
    ofColor getColorAtIndex(uint index);
    int getSize();
    
    ColorPalette(vector<ofColor> colors);
    ColorPalette() = default;

    
private:
    int _index = -1;
    
    vector<ofColor> _colors;
    

    
};


#endif /* ColorPalette_h */
