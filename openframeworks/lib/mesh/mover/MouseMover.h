//
//  MouseMover.h
//
//  Created by Mike Chambers on 4/19/18.
//

#ifndef MouseMover_h
#define MouseMover_h

#include <stdio.h>
#include "Mover.h"

class MouseMover : public Mover {
public:
    void update() override;
};

#endif /* MouseMover_h */
