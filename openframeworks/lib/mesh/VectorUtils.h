//
//  VectorUtills,h
//  Persistence
//
//  Created by Mike Chambers on 4/17/16.
//
//

#ifndef VectorUtills_hpp
#define VectorUtills_hpp

#include <stdio.h>
#include "ofMain.h"
#include "Mover.h"

class VectorUtils {
public:
    static ofVec3f calculateDrag(Mover mover, float dragCoefficient);
    
};

#endif /*VectorUtills_hpp */
