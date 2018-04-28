//
//  TweenMover.cpp
//  EasingPlay
//
//  Created by Mike Chambers on 4/26/18.
//

#include "TweenMover.h"
#include "ofxEasing.h"
#include "Mover.h"
#include "PointTween.h"

void TweenMover::addDestination(ofVec3f destination){
    
    shared_ptr<PointTween> tween(new PointTween());
    
    ofVec3f startPosition = position;
    
    if(!_tweens.empty()) {
        PointTween &t = *_tweens.back();
        startPosition = t.getDestination();
    }
    
    //start position need to be set to the destination of the previous tween
    tween->setTween(startPosition, destination, 1000, ofxeasing::Function::Bounce, ofxeasing::Type::Out, 0);
    
    _tweens.push_back(tween);
}

void TweenMover::start() {
    if(_tweens.empty()){
        return;
    }
    
    _tweens.at(0)->start();
}

void TweenMover::update() {
    if(_tweens.empty()){
        return;
    }
    
    PointTween &tween = *_tweens.at(0);
    tween.update();
    
    position = tween.getCurrentPosition();
    
    if(tween.tweenIsCompleted()) {
        _tweens.erase(_tweens.begin());
        start();
    }
    
    
    
}
