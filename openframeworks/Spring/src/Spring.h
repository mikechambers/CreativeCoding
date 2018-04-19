//
//  Spring.hpp
//  Spring
//
//  Created by Mike Chambers on 4/17/18.
//

#ifndef Spring_h
#define Spring_h

#include <stdio.h>
#include "Follower.h"

class Spring : public Follower {
 
public:
    
    float friction = .01;
    
    void update() override;
    Spring(const Spring &source);
    Spring();
    Spring(Mover * _target);
};

#endif /* Spring_hpp */
