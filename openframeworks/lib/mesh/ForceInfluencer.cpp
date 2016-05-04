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
    
    //should we limit distance?
    //both min and max?
    
    ofVec3f out;
    if(distance > influenceRadius) {
        return out;
    }
    
    out = location - mover.location;
    out.normalize();
    
    //how much force is applied
    out *= (ofMap(distance, 0, influenceRadius, minForce, maxForce));
    
    
    if(forceType == REPEL) {
        out *= -1;
    }
    
    //this is really inefficent. tons of copying, especially when we
    //dont change anything
    return out;
}