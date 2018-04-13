//
//  Node.hpp
//  Quick5
//
//  Created by Mike Chambers on 4/11/18.
//

#ifndef Node_hpp
#define Node_hpp

#include <stdio.h>
#include "Mover.h"
#include "Follower.h"

class Node : public Follower {
    public:
        //float attractionCoefficient = 0.1;
        int aCoefficientDirection = 1;
        float minRange = 2.0;
        float maxRange = 8.0;
        float stepSize = 0.02;

        void update();
        void setTarget(Node * _target);
        Node(ofVec3f _location, float _minRange, float _maxRange, float _stepSize);
};

#endif /* Node_hpp */


