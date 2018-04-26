//
//  Swatch.cpp
//  ColorP
//
//  Created by Mike Chambers on 4/25/18.
//

#include "Swatch.h"
#include "ofxEasing.h"

Swatch::Swatch() {
    destination = ofVec3f();
    position = ofVec3f();
}

Swatch::Swatch(ofColor _color) {
    color = _color;
    
    //figure out how to call default constructor for this
    destination = ofVec3f();
    position = ofVec3f();
}

void Swatch::startAfterDelay(int delay, int duration) {
    _delay = delay;
    _duration = duration;
    
    _delayStartTime = ofGetElapsedTimeMillis();
}

void Swatch::start(int duration) {
    _startTime = ofGetElapsedTimeMillis();
    _duration = duration;
    _startPosition = position;
}

void Swatch::update() {
    
    if(_delay != -1) {
        
        if(ofGetElapsedTimeMillis() >= _delayStartTime + _delay) {
            start(_duration);
            _delay = -1;
        }
        return;
    }
    
    
    int endTime = _startTime + _duration;

    if(ofGetElapsedTimeMillis() > endTime) {
        position = destination;
        return;
    }
    
    float t = ofGetElapsedTimeMillis() - _startTime;
    float d = _duration;
    
    position.x = ofxeasing::exp::easeOut(
                        t,
                        _startPosition.x,
                        _startPosition.x - destination.x,
                        d);

    position.y = ofxeasing::exp::easeOut(
                                        t,
                                        _startPosition.y,
                                        destination.y - _startPosition.y,
                                        d);
}

/*
 @t is the current time (or position) of the tween. This can be seconds or frames, steps, seconds, ms, whatever – as long as the unit is the same as is used for the total time [3].
 @b is the beginning value of the property.
 @c is the change between the beginning and destination value of the property.
 @d is the total time of the tween.
 */


