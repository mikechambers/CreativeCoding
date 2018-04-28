//
//  Tween.cpp
//  EasingPlay
//
//  Created by Mike Chambers on 4/26/18.
//

#include "PointTween.h"

void PointTween::setTween(ofVec3f startPosition,
                       ofVec3f endPosition,
                       int duration,
                       ofxeasing::Function tweenGroup,
                          ofxeasing::Type tweenType,
                       int delay){
    
    _startPosition = startPosition;
    _destination = endPosition;
    _duration = duration;
    _tweenGroup = tweenGroup;
    _tweenType = tweenType;
    _currentPosition = _startPosition;
    
    if(delay) {
        _delay = delay;
    }
}

void PointTween::start() {
    if(_delay > 0) {
        _timeToStart = ofGetElapsedTimeMillis() + _delay;
        
        return;
    }
    
    _tweenIsCompleted = false;
    _startTime = ofGetElapsedTimeMillis();
}

void PointTween::update() {
    if(_delay != -1) {
        if(ofGetElapsedTimeMillis() >= _timeToStart) {
            _delay = -1;
            start();
        }
        return;
    }
    
    int endTime = _startTime + _duration;
    if(ofGetElapsedTimeMillis() > endTime) {
        _currentPosition = _destination;
        
        //_animating = false;
        _tweenIsCompleted = true;
        return;
    }
    
    float t = ofGetElapsedTimeMillis() - _startTime;
    float d = _duration;

    ofxeasing::function func = ofxeasing::easing(_tweenGroup, _tweenType);

    _currentPosition.x = func(t,
                        _startPosition.x,
                        _destination.x  - _startPosition.x,
                        d);
    
    _currentPosition.y = func(t,
                        _startPosition.y,
                        _destination.y - _startPosition.y,
                        d);
}

bool PointTween::tweenIsCompleted() {
    return _tweenIsCompleted;
}

ofVec3f PointTween::getCurrentPosition() {
    return _currentPosition;
}

ofVec3f PointTween::getStartPosition() {
    return  _startPosition;
}

ofVec3f PointTween::getDestination() {
    return  _destination;
}
