//
//  Follower.h
//
//  Created by Mike Chambers on 4/19/18.
//

#ifndef Follower_h
#define Follower_h

#include <stdio.h>
#include "Mover.h"

class Follower : public Mover {
public:
    Mover * target;
    float attractionCoefficient = 0.3;

    virtual void update() override;
    void update(ofVec3f t);

    Follower() = default;
};

#endif /* Follower_h */
