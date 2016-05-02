//
//  Attractor.cpp
//  Persistence
//
//  Created by Mike Chambers on 4/23/16.
//
//

#include "ForceInfluencer.h"


//create an enum for force influence type

ofVec3f ForceInfluencer::influence(Mover mover) {
    
    float distance = mover.location.distance(location);
    
    
    ofVec3f out;
    if(distance > influenceRadius) {
        return out;
    }
    
    out = location - mover.location;
    out.normalize();
    
    //how much force is applied
    out *= (ofMap(distance, 0, influenceRadius, minForce, maxForce));
    
    
    if(forceType == ForceType::REPEL) {
        out *= -1;
    }
    
    
    /*
    ofVec3f friction = mover.velocity * -1;
    friction.normalize();
    friction *= FRICTION_COEFFICIENT;
    
    friction.set(0.0,0.0,0.0);
    */
     
    //mover->applyForce(f + friction);
    
    
    //this is really inefficent. tons of copying, especially when we
    //dont change anything
    return out;
}