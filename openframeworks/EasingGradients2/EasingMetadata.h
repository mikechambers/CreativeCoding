//
//  EasingMetadata.h
//  EasingGradients2
//
//  Created by Mike Chambers on 5/1/18.
//

#ifndef EasingMetadata_h
#define EasingMetadata_h

#include <stdio.h>
#include "ofxeasing.h"
#include "ofMain.h"

class EasingMetadata {
public:
    string name = "";
    ofxeasing::Function family;
    ofxeasing::Type type;
};

#endif /* EasingMetadata_h */
