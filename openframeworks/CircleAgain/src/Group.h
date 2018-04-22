//
//  Group.h
//  Spring
//
//  Created by Mike Chambers on 4/17/18.
//

#ifndef Group_hpp
#define Group_hpp

#include <stdio.h>
#include "Mover.h"
#include "Follower.h"
#include "ofMain.h"

class Group {
public:
    Mover anchor;
    Follower spring;
    
    void init(ofVec3f location);
    Group(const Group &source);
    Group();
};

#endif /* Group_hpp */

