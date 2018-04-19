//
//  Mover.cpp
//  Persistence
//
//  Created by Mike Chambers on 4/17/16.
//
//

#include "Mover.h"
#include "MeshUtils.h"


//todo
/*
 - move bounds check to seperate function (check bounds?) and out of update
 -add apis to calculating gravity, friction, etc... perhaps in util class
*/



Mover::Mover() {
    velocity = ofVec3f(0.0, 0.0, 0.0);
    location = ofVec3f(0.0, 0.0, 0.0);
    acceleration = ofVec3f(0.0, 0.0, 0.0);
    
    mass = 1.0;
    
}

void Mover::applyForce(ofVec3f force) {
    acceleration += (force / mass);
}

void Mover::update() {
    velocity.limit(limit);
    velocity += acceleration;
    location += velocity;
    
    acceleration.set(0.0, 0.0, 0.0);
    
    updateAngle();
}

void Mover::updateAngle() {
    angle = ofRadToDeg(atan2(velocity.y, velocity.x));
}

ofVec3f Mover::repel(Mover mover) {
    return (attract(mover) *= -1);
}

ofVec3f Mover::attract(Mover mover) {
    ofVec3f force = location - mover.location;
    float distance = mConstrain(force.length(), minGravityInfluence, maxGravityInfluence);
    
    force.normalize();
    
    float strength = (gravity_coefficient * mass * mover.mass) / (distance * distance);
    force *= strength;

    return force;
}

void Mover::checkBounds(ofRectangle _bounds) {
    if(location.x < bounds2d.x || location.x > bounds2d.width) {
        velocity.x *= -1;
    }
    
    if(location.y < bounds2d.y || location.y > bounds2d.height) {
        velocity.y *= -1;
    }
}

void Mover::checkBounds() {
    checkBounds(bounds2d);
}

void Mover::setBounds(ofRectangle bounds) {
    bounds2d = bounds;
}

void Mover::setToRandomLocation() {
    location.set(ofRandomWidth(), ofRandomHeight());
}

void Mover::setToRandomVelocity(float max) {
    
    //todo: these vars are not being used
    float s1 = (ofRandom(1) > 0.5)? max : -1;
    float s2 = (ofRandom(1) > 0.5)? max : -1;
    float s3 = (ofRandom(1) > 0.5)? max : -1;
    float s4 = (ofRandom(1) > 0.5)? max : -1;
    
    velocity.set(ofRandom(-max, max), ofRandom(-max, max));
}
