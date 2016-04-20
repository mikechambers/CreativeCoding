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
    void setTarget(Mover * _target);
    virtual void update();
    void update(ofVec3f t);
    Follower();
};


#endif /* Follower_hpp */
