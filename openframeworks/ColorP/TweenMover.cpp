//
//  TweenMover.h
//  ColorP
//
//  Created by Mike Chambers on 4/25/18.
//

#include "TweenMover.h"
#include "ofxEasing.h"

TweenMover::TweenMover(){
    _destination = ofVec3f();
    _startPosition = ofVec3f();
}

void TweenMover::setDestination(ofVec3f destination) {
    _destination = destination;
}

bool TweenMover::isCompleted() {
    return _animationCompleted;
}

void TweenMover::start() {
    _startTime = ofGetElapsedTimeMillis();
    _startPosition = position;
    
    _animating = true;
    _animationCompleted = false;
}

void TweenMover::start(int duration, int delay) {

    _animationCompleted = false;
    _duration = duration;
    
    if(delay > 0) {
        _delay = delay;
        _timeToStart = ofGetElapsedTimeMillis() + _delay;
        
        return;
    }
}

void TweenMover::update() {
    if(_delay != -1) {
        if(ofGetElapsedTimeMillis() >= _timeToStart) {
            start();
            _delay = -1;
        }
        return;
    }
    
    int endTime = _startTime + _duration;
    if(ofGetElapsedTimeMillis() > endTime) {
        position = _destination;
        
        _animating = false;
        _animationCompleted = true;
        return;
    }
    
    float t = ofGetElapsedTimeMillis() - _startTime;
    float d = _duration;
    
    position.x = ofxeasing::exp::easeOut(
                                         t,
                                         _startPosition.x,
                                         _startPosition.x - _destination.x,
                                         d);
    
    position.y = ofxeasing::exp::easeOut(
                                         t,
                                         _startPosition.y,
                                         _destination.y - _startPosition.y,
                                         d);
    
    
}

