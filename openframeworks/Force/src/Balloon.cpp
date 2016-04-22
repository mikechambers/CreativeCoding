//
//  Balloon.cpp
//  Force
//
//  Created by Mike Chambers on 4/21/16.
//
//

#include "Balloon.h"


Balloon::Balloon() {
    helium = ofVec3f(0.0, 0.0, 0.0);
}

void Balloon::update() {
    applyForce(helium);
    Mover::update();
}