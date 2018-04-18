//
//  Group.hpp
//  Spring
//
//  Created by Mike Chambers on 4/17/18.
//

#ifndef Group_hpp
#define Group_hpp

#include <stdio.h>
#include "Mover.h"
#include "Spring.h"
#include "ofMain.h"

class Group {
public:
    Mover anchor;
    Spring spring;
    ofColor color;
    
    void init(ofVec3f location);
};

#endif /* Group_hpp */
