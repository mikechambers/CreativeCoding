//
//  MouseMover.cpp
//  MoverRefactorWork
//
//  Created by Mike Chambers on 4/19/18.
//

#include "MouseMover.h"

void MouseMover::update() {
    position.x = ofGetMouseX();
    position.y = ofGetMouseY();
}
