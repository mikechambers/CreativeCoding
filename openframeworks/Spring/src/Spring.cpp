//
//  Spring.cpp
//  Spring
//
//  Created by Mike Chambers on 4/17/18.
//

#include "Spring.h"

void Spring::update() {
    
    ofVec3f force = velocity * -1;
    //force *= -1;
    force.normalize();
    force *= friction;
    
    
    applyForce(force);
    
    Follower::update();
}
