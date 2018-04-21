//
//  Mover.h
//  MoverRefactorWork
//
//  Created by Mike Chambers on 4/19/18.
//

#ifndef Mover_h
#define Mover_h

#include <stdio.h>
#include  "ofMain.h"

class Mover {
    
public:
    ofVec3f velocity;
    ofVec3f acceleration;
    float mass = 1.0;
    float friction = 0.0;
    ofVec3f position;
    
    //in degrees
    float angle;
    
    float minGravityInfluence = 1.0;
    float maxGravityInfluence = 200.0;
    float gravityCoefficient = 0.3;
    
    /** Maxium velocity **/
    float maxVelocity = 5.0;
    
    Mover();
    void applyForce(ofVec3f force);
    void virtual update();
    ofVec3f repel(Mover mover);
    ofVec3f attract(Mover mover);
    
protected:
    void updateAngle();
};

#endif /* Mover_h */
