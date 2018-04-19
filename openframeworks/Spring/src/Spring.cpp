//
//  Spring.cpp
//  Spring
//
//  Created by Mike Chambers on 4/17/18.
//

#include "Spring.h"
#include "Follower.h"

Spring::Spring():Follower() {
    
}
Spring::Spring(Mover * _target) : Follower(_target) {
    
}

Spring::Spring(const Spring &source) : Follower(source){
    friction = source.friction;
}

void Spring::update() {
    
    ofVec3f force = velocity * -1;
    //force *= -1;
    force.normalize();
    force *= friction;
    
    applyForce(force);
    
    Follower::update();
}
