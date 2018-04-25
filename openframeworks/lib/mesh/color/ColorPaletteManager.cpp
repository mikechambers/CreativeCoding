//
//  ColorPaletteManager.cpp
//  PerlinPlayRender
//
//  Created by Mike Chambers on 4/24/18.
//

#include "ColorPaletteManager.h"

ColorPaletteManager::ColorPaletteManager(){
    _palette = getNextColorPalette();
}

ColorPalette ColorPaletteManager::getNextColorPalette() {
    _index++;
    
    if(_index == COLS) {
        _index = 0;
    }
    
    return getColorPaletteAtIndex(_index);
}

ColorPalette ColorPaletteManager::getColorPaletteAtIndex(uint index) {
    
    vector<ofColor> out;
    for(int i = 0; i < COLS; i++) {
        out.push_back(ofColor::fromHex(colors[_index][i]));
    }
    
    ColorPalette tmp = ColorPalette(out);
    return tmp;
}

ColorPalette ColorPaletteManager::getRandomColorPalette() {
    int rIndex = _index;
    while(rIndex == _index) {
        _index = rand() % ROWS;
    }
    
    _palette = getColorPaletteAtIndex(_index);
    
    return _palette;
}

ColorPalette ColorPaletteManager::getCurrentColorPalette(){
    return _palette;
}

int ColorPaletteManager::getCurrentIndex(){
    return _index;
}

