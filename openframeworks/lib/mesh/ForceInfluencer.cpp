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
    
    if(forceType == ATTRACT) {
        return attract(mover);
    } else {
        return repel(mover);
    }
}