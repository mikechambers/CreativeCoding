//
//  Spring.cpp
//  Spring
//
//  Created by Mike Chambers on 4/17/18.
//

#include "SpringMover.h"

void SpringMover::setAnchor(Mover * _anchor) {
    anchor = _anchor;
}

void SpringMover::update() {
    ofVec3f force = (anchor->location - location);
 
    cout << anchor->location.x << endl;
    
    float d = force.length();
    float stretch = d - springLength;
    force.normalize();
    
    force *= 1 * k * stretch;
    
    applyForce(force);
    
    Mover::update();
}

/*
 PVector force = PVector.sub(a.position, b.position);
 // What is distance
 float d = force.mag();
 // Stretch is difference between current distance and rest length
 float stretch = d - len;
 
 // Calculate force according to Hooke's Law
 // F = k * stretch
 force.normalize();
 force.mult(-1 * k * stretch);
 a.applyForce(force);
 force.mult(-1);
 b.applyForce(force);
 */
