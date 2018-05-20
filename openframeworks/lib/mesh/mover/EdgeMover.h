//
//  EdgeMover.h
//
//
//  Created by Mike Chambers on 5/18/18.
//


#ifndef EdgeMover_h
#define EdgeMover_h

#include <stdio.h>
#include "Mover.h"

class EdgeMover : public Mover {
    public:
    EdgeMover();
    EdgeMover(ofRectangle _bounds);
    
    void update() override;
    ofRectangle bounds;
    
    private:
    void checkEdges();
};

#endif /* EdgeMover_h */
