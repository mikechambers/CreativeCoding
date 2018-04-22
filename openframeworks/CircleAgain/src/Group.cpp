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

Group::Group(const Group &source) {
    
    spring = source.spring;
    anchor = source.anchor;
}

void Group::init(ofVec3f position) {
    spring.target = &anchor;
    //spring.friction = 0.01;
    spring.position = position;
    
    anchor.position = position;
}

