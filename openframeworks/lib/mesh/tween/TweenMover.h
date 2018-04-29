//
//  TweenMover.hpp
//  EasingPlay
//
//  Created by Mike Chambers on 4/26/18.
//

#ifndef TweenMover_h
#define TweenMover_h

#include <stdio.h>
#include "ofMain.h"
#include "PointTween.h"
#include "Mover.h"

//does extending Mover give us anything?
class TweenMover : public Mover {
public:
    void addDestination(ofVec3f destination);
    void addDestination(ofVec3f destination, int duration,
                    ofxeasing::Function tweenGroup, ofxeasing::Type tweenType, int delay);
    
    void start();
    
    void update();
    
    void onTweenComplete(bool & value);
    
private:
    vector<shared_ptr<PointTween>> _tweens;
    bool _hasBeenStarted = false;
    void initNextTween();
};


#endif /* TweenMover_h */
