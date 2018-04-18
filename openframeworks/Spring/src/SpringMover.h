//
//  Spring.hpp
//  Spring
//
//  Created by Mike Chambers on 4/17/18.
//

#ifndef SpringMover_h
#define SpringMover_h

#include <stdio.h>
#include "ofMain.h"
#include "Mover.h"

class SpringMover : public Mover {
    
private:
    Mover * anchor;
    float springLength = 5;
    float k = 0.2;
    float damping = 0.9;

public:
    void setAnchor(Mover * _anchor);
    void update();
};


#endif /* Spring_h */
