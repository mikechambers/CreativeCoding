//
//  Mover.hpp
//  Persistence
//
//  Created by Mike Chambers on 4/17/16.
//
//

#ifndef Mover_hpp
#define Mover_hpp

#include <stdio.h>
#include "ofMain.h"

class Mover {
    public:
        ofVec3f location;
        ofVec3f velocity;
        ofVec3f acceleration;
    
        //should this be a rectangle or ofBoxPrimitive?
        //maybe create a 3d mover and a 3d mover, both which use ofVec3f
        //maybe mnover defaults to 2d, and then there is a 3d mover
    
    
        virtual void update();
    
        void setBounds(ofRectangle b);
        void setToRandomLocation();
        void setToRandomVelocity(float max);
    
        Mover();
        Mover(ofRectangle bounds);
    
    private:
        ofRectangle bounds2d;
};

#endif /* Mover_hpp */
