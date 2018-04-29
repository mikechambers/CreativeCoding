//
//  Tween.hpp
//  EasingPlay
//
//  Created by Mike Chambers on 4/26/18.
//

#ifndef PointTween_h
#define PointTween_h

#include <stdio.h>
#include "ofMain.h"
#include "ofxEasing.h"

class PointTween {
public:
    void setTween(ofVec3f startPosition,
          ofVec3f endPosition,
          int duration,
          ofxeasing::Function tweenGroup,
          ofxeasing::Type tweenType,
          int delay);
    
    //do we want to return a point here?
    void update();
    
    void start();
    
    ofVec3f getCurrentPosition();
    ofVec3f getStartPosition();
    ofVec3f getDestination();
    bool tweenIsCompleted();
    
    ofEvent<bool> onTweenComplete;
    //ofEvent<const bool> onAnimationStart;
    //ofEvent<const bool> onTweenStart;
    
private:
    ofVec3f _startPosition;
    ofVec3f _destination;
    ofVec3f _currentPosition;
    
    int _delay;
    int _duration;
    uint64_t _timeToStart = 0;
    uint64_t _startTime = 0;
    
    bool _tweenIsCompleted = false;
    bool _tweenHasBeenStarted = false;
    
    ofxeasing::Function _tweenGroup;
    ofxeasing::Type _tweenType;
    
    bool _onTweenCompleteSent = false;
};

#endif /* PointTween_h */
