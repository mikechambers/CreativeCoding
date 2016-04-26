//
//  Mover.hpp
//  Persistence
//
//  Created by Mike Chambers on 4/17/16.
//
//

#ifndef ForceInfluencer_hpp
#define ForceInfluencer_hpp

#include <stdio.h>
#include "ofMain.h"
#include "Mover.h"


enum ForceType { ATTRACT, REPEL };

class ForceInfluencer : public Mover {
public:
    
    ForceType forceType = ForceType::ATTRACT;
    float influenceRadius = 20.0;
    float minForce = 0.1;
    float maxForce = 0.9;
    
    ofVec3f influence(Mover mover);
    
private:

};

#endif /* ForceInfluencer_hpp */
