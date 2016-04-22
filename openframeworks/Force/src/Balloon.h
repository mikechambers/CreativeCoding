//
//  Balloon.hpp
//  Force
//
//  Created by Mike Chambers on 4/21/16.
//
//

#ifndef Balloon_hpp
#define Balloon_hpp

#include <stdio.h>
#include "Mover.h"
#include "ofMain.h"

class Balloon : public Mover {
    
private:
    ofVec3f helium;
    
public:
    Balloon();
    void update();
};


#endif /* Balloon_hpp */
