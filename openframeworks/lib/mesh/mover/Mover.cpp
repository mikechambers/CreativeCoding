//
//  Mover.cpp
//  MoverRefactorWork
//
//  Created by Mike Chambers on 4/19/18.
//

#include "Mover.h"

Mover::Mover(){
    velocity = ofVec3f(0,0,0);
    acceleration = ofVec3f(0,0,0);
    position = ofVec3f(0,0,0);
}

void Mover::applyForce(ofVec3f force) {
    acceleration += (force / mass);
}

void Mover::update() {
    
    if(friction != 0) {
        ofVec3f force = velocity * -1;
        force.normalize();
        force *= friction;
        
        applyForce(force);
    }
    
    velocity.limit(maxVelocity);
    velocity += acceleration;
    position += velocity;
    
    updateAngle();
}

void Mover::updateAngle() {
    angle = ofRadToDeg(atan2(velocity.y, velocity.x));
}

ofVec3f Mover::repel(Mover mover) {
    return (attract(mover) *= -1);
}

ofVec3f Mover::attract(Mover mover) {
    ofVec3f force = position - mover.position;
    //float distance = mConstrain(force.length(), minGravityInfluence, maxGravityInfluence);
    
    float distance = ofClamp(force.length(), minGravityInfluence, maxGravityInfluence);
    
    force.normalize();
    
    float strength = (gravityCoefficient * mass * mover.mass) / (distance * distance);
    force *= strength;
    
    return force;
}
