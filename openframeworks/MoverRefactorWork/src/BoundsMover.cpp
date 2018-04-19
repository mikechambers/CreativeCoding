//
//  BoundsMover.cpp
//  MoverRefactorWork
//
//  Created by Mike Chambers on 4/19/18.
//

#include "BoundsMover.h"

bool BoundsMover::checkBounds(ofRectangle _bounds) {
    
    bool hitBounds = false;
    if(position.x < _bounds.x || position.x > _bounds.width) {
        velocity.x *= -1;
        hitBounds = true;
    }
    
    if(position.y < _bounds.y || position.y > _bounds.height) {
        velocity.y *= -1;
        hitBounds = true;
    }
    
    return hitBounds;
}

bool BoundsMover::checkBounds() {
    return checkBounds(bounds);
}

void BoundsMover::update() {
    checkBounds();
    Mover::update();
}
