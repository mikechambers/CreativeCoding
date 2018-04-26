//
//  Swatch.h
//  ColorP
//
//  Created by Mike Chambers on 4/25/18.
//

#ifndef Swatch_h
#define Swatch_h

#include <stdio.h>
#include "ofMain.h"

class Swatch {

public:
    ofVec3f position;
    ofVec3f destination;
    ofColor color;
    float width = 50;
    float height = 50;
    
    Swatch(ofColor _color);
    Swatch();
    
    void startAfterDelay(int delay, int duration);
    void start(int duration);
    void update();
    
private:
    int _delay = -1;
    uint64_t _delayStartTime = -1;
    uint64_t _startTime = -1;
    int _duration = -1;
    ofVec3f _startPosition;
};

#endif /* Swatch_h */
