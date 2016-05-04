//
//  Follower.cpp
//  Persistence
//
//  Created by Mike Chambers on 4/19/16.
//
//

#include "Follower.h"

Follower::Follower() {
}

void Follower::setTarget(Mover * _target) {
    target = _target;
}

void Follower::update() {
    update(target->location);
}

void Follower::update(ofVec3f t) {
    
    //do we need this limit?
    velocity.limit(5);
    ofVec3f dir = t - location;
    dir.normalize();
    dir *= 0.5;
    acceleration = dir;
    velocity += acceleration;
    location += velocity;
    
    updateAngle();
}