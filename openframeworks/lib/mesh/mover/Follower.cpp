//
//  Follower.cpp
//
//  Created by Mike Chambers on 4/19/18.
//

#include "Follower.h"

void Follower::update() {
    update(target->position);
}

void Follower::update(ofVec3f t) {

    ofVec3f dir = t - position;
    dir.normalize();
    dir *= attractionCoefficient;
    
    //this used to be =, which would reset acceleration, ignoring
    //any changes through apply force
    acceleration += dir;
    
    Mover::update();
    
    //updateAngle();
    acceleration *= 0;
}
