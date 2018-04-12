//
//  Node.cpp
//  Quick5
//
//  Created by Mike Chambers on 4/11/18.
//

#include "Node.h"

Node::Node(ofVec3f _location, float _minRange, float _maxRange, float _stepSize) {
    
    location = _location;
    minRange = _minRange;
    maxRange = _maxRange;
    stepSize = _stepSize;
    
    attractionCoefficient = minRange;
}

void Node::setTarget(Node * _target) {
    target = _target;
}

void Node::update() {
    Follower::update(target->location);

    attractionCoefficient += stepSize * aCoefficientDirection;
    
    if(attractionCoefficient > maxRange) {
        aCoefficientDirection *= -1;
        attractionCoefficient = maxRange;
    } else if (attractionCoefficient < minRange) {
        aCoefficientDirection *= -1;
        attractionCoefficient = minRange;
    }
}
