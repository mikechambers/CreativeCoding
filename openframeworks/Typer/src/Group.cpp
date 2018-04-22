//
//  Group.cpp
//  Spring
//
//  Created by Mike Chambers on 4/17/18.
//

#include "Group.h"
#include "ofMain.h"
#include "MeshUtils.h"


Group::Group(){
}

/*
Group::Group(const Group &source) {
    
    spring = source.spring;
    anchor = source.anchor;
}
 */

void Group::init(ofVec3f anchorPosition, ofVec3f springPosition, char _letter) {
    spring.target = &anchor;
    spring.friction = 0.07;
    spring.position = springPosition;
    //spring.attractionCoefficient = 0.3;
    spring.velocity = mGetRandomVelocity(10);
    
    color = mRandomColor(200);
    
    anchor.position = anchorPosition;
    
    letter = _letter;
}

