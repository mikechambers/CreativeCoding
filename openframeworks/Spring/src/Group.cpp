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
    color = source.color;
    
    spring = source.spring;
    anchor = source.anchor;
}

void Group::init(ofVec3f location) {
    //color = mRandomColor();
    color = ofColor(ofColor::lightBlue, 128);

    spring.setTarget(&anchor);
    spring.location = location;
    
    anchor.location = location;
}
