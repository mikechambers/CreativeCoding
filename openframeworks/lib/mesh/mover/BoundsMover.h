//
//  BoundsMover.h
//  MoverRefactorWork
//
//  Created by Mike Chambers on 4/19/18.
//

#ifndef BoundsMover_h
#define BoundsMover_h

#include <stdio.h>
#include "Mover.h"

class BoundsMover :  public Mover {
public:
    ofRectangle bounds;
    bool checkBounds();
    bool checkBounds(ofRectangle _bounds);
    void update() override;
};

#endif /* BoundsMover_h */
