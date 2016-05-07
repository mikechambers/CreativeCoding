//
//  Follower.hpp
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
    
    void setTarget(Mover * _target);
    void update();
    void update(ofVec3f t);
};


#endif /* Follower_hpp */
