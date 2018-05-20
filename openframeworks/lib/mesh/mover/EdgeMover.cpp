
//
//  EdgeMover.cpp
//
//
//  Created by Mike Chambers on 5/18/18.
//

#include "EdgeMover.h"

EdgeMover::EdgeMover() {
    maxVelocity = 4;
}

//todo: need to figure out how to have this constructor call
//default constructor
EdgeMover::EdgeMover(ofRectangle _bounds) {
    maxVelocity = 4;
    bounds = _bounds;
}

void EdgeMover::update() {
    Mover::update();
    checkEdges();
}

void EdgeMover::checkEdges(){
    if(position.x < bounds.x) {
        position.x = bounds.width;
    } else if (position.x > bounds.width) {
        position.x = bounds.x;
    }
    
    if (position.y > bounds.height) {
        position.y = bounds.y;
    } else if (position.y < bounds.y) {
        position.y = bounds.height;
    }
}

