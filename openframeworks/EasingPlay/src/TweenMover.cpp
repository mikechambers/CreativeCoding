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
#include "ofMain.h"

void TweenMover::addDestination(ofVec3f destination){
    
    shared_ptr<PointTween> tween(new PointTween());
    
    ofVec3f startPosition = position;
    
    if(!_tweens.empty()) {
        PointTween &t = *_tweens.back();
        startPosition = t.getDestination();
    }
    
    //start position need to be set to the destination of the previous tween
    tween->setTween(startPosition, destination, 1000, ofxeasing::Function::Bounce, ofxeasing::Type::Out, 0);
    
    bool isFirstTween = _tweens.empty();
    _tweens.push_back(tween);
    
    if(isFirstTween) {
        initNextTween();
    }
}

void TweenMover::start() {
    initNextTween();
    
    _hasBeenStarted = true;
}

void TweenMover::initNextTween() {
    
    cout << "start" << endl;
    if(_tweens.empty()){
        return;
    }
    
    PointTween &tween = *_tweens.at(0);

    cout << "registering for onTweenComplete" << endl;
    ofAddListener(
                  tween.onTweenComplete,
                  this,
                  &TweenMover::onTweenComplete);
    
 //_tweens.at(0)->start();
    //tween.start();
}

void TweenMover::onTweenComplete(bool & value) {
    cout << "tween complete" << endl;
    
    PointTween &tween = *_tweens.at(0);
    
    ofRemoveListener(tween.onTweenComplete,
                     this,
                     &TweenMover::onTweenComplete);
    
    _tweens.erase(_tweens.begin());
    initNextTween();
    
}

void TweenMover::update() {
    if(!_hasBeenStarted || _tweens.empty()){
        return;
    }
    
    
    PointTween &tween = *_tweens.at(0);
    
    tween.update();
    
    position = tween.getCurrentPosition();
    
    /*
    if(tween.tweenIsCompleted()) {
        _tweens.erase(_tweens.begin());
        start();
    }
     */
}
