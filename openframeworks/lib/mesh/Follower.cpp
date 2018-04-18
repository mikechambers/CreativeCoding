//
//  Follower.cpp
//  Persistence
//
//  Created by Mike Chambers on 4/19/16.
//
//

#include "Follower.h"

void Follower::setTarget(Mover * _target) {
    target = _target;
}

void Follower::setIndex(int _index) {
    index = _index;
}

void Follower::update() {
    update(target->location);
}

void Follower::update(ofVec3f t) {
    
    //do we need this limit?
    velocity.limit(limit);
    ofVec3f dir = t - location;
    dir.normalize();
    dir *= attractionCoefficient;
    
    //this used to be =, which would reset acceleration, ignoring
    //any changes through apply force
    acceleration += dir;
    velocity += acceleration;
    location += velocity;
    
    updateAngle();
    acceleration *= 0;
}
