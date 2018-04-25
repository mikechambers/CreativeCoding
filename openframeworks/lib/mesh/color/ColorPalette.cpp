//
//  ColorPalette.cpp
//  PerlinPlayRender
//
//  Created by Mike Chambers on 4/23/18.
//

#include "ColorPalette.h"

ColorPalette::ColorPalette(vector<ofColor> colors) {
    setColors(colors);
}

void ColorPalette::setColors(vector<ofColor> colors) {
    _colors = colors;
}

vector<ofColor> ColorPalette::getColors() {
    return _colors;
}

ofColor ColorPalette::getColorAtIndex(uint index){
    if(index > _colors.size() - 1) {
        cout << "WARNING: ColorPalette::getColorAtIndex() : requested index out of bounds." << endl;
    }
    
    _index = index;
    return _colors.at(index);
}

//add  code to avoid returning same color twice in a row.
ofColor ColorPalette::getRandomColor(){
    
    int index = _index;
    int rIndex = index;
    while(rIndex == index) {
        index = rand() % _colors.size();
    }
    
    return getColorAtIndex(index);
}

ofColor ColorPalette::getNextColor(){
    
    _index++;
    
    if(_index == _colors.size()){
        _index = 0;
    }
    
    return getColorAtIndex(_index);
}

int ColorPalette::getSize() {
    return _colors.size();
}

