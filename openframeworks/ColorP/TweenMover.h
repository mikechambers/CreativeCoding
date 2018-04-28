//
//  TweenMover.h
//  ColorP
//
//  Created by Mike Chambers on 4/25/18.
//

#ifndef TweenMover_h
#define TweenMover_h

#include <stdio.h>
#include "Mover.h"
#include "ofMain.h"

class TweenMover : public Mover {
public:
    
    TweenMover();
    
    //could say addDes
    
    //basically, can add a destination and how to tween it, and then
    //it chains them
    void addDestination(ofVec3f destination, ofxTween  tween);
    bool isCompleted();
    void start(int duration, int delay = 0);
    void update();
    
private:
    ofVec3f _destination;
    ofVec3f _startPosition;
    
    int _delay = -1;
    
    bool _animationCompleted = false;
    bool _animating = false;
    
    uint64_t _timeToStart = 0;
    uint64_t _startTime = 0;
    uint64_t _duration = 0;
    
    void start();
};

#endif /* TweenMover_h */
