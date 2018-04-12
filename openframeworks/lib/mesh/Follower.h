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
    
    int index = 0;
    
    void setIndex(int _index);
    
    virtual void setTarget(Mover * _target);
    virtual void update();
    void update(ofVec3f t);
};


#endif /* Follower_hpp */
