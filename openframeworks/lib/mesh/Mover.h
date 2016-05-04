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
        float mass;
    
        //in degrees
        float angle;
    
        float minGravityInfluence = 5.0;
        float maxGravityInfluence = 25.0;
        float gravity_coefficient = 0.4;
    
        //should this be a rectangle or ofBoxPrimitive?
        //maybe create a 3d mover and a 3d mover, both which use ofVec3f
        //maybe mnover defaults to 2d, and then there is a 3d mover
    
    
        virtual void update();
    
        void setBounds(ofRectangle b);
        void checkBounds();
        void checkBounds(ofRectangle _bounds);
    
        void setToRandomLocation();
        void setToRandomVelocity(float max);
    
        void applyForce(ofVec3f force);
        ofVec3f attract(Mover mover);
        ofVec3f repel(Mover mover);
    
        Mover();
        Mover(ofRectangle bounds);
    
    protected:
        void updateAngle();
    
    private:
        ofRectangle bounds2d;
};

#endif /* Mover_hpp */
