//
//  Group.cpp
//  Spring
//
//  Created by Mike Chambers on 4/17/18.
//

#include "Group.h"
#include "ofMain.h"
#include "MeshUtils.h"

void Group::init(ofVec3f location) {
    color = mRandomColor();
    
    anchor.location = location;
    
    spring.setTarget(&anchor);
    spring.location = location;
}
