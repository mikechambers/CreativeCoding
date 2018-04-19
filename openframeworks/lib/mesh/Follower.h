//
//  Follower.h
//  Persistence
//
//  Created by Mike Chambers on 4/19/16.
//
//

#ifndef Follower_hpp
#define Follower_hpp

#include <stdio.h>
#include "Mover.h"
#include "ofMain.h"

class Follower : public Mover {

public:
    Mover * target;
    float attractionCoefficient = 0.1;
    
    int index = 0;
    float friction = 0.0;
    
    void setIndex(int _index);
    
    void setTarget(Mover * _target);
    virtual void update() override;
    virtual void update(ofVec3f t);
    Follower(const Follower &obj);
    Follower(Mover * _target);
    Follower();
};


#endif /* Follower_hpp */
