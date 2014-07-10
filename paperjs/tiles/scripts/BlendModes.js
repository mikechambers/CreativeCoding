/*jslint vars: true,nomen: true,plusplus: true,continue:true,forin:true */

(function () {
    "use strict";

    var BlendModes = {
        NORMAL: 'normal',
        MULTIPLY: 'multiply',
        SCREEN: 'screen',
        OVERLAY: 'overlay',
        SOFT_LIGHT: 'soft-light',
        HARD_LIGHT: 'hard-light',
        COLOR_DODGE: 'color-dodge',
        COLOR_BURN: 'color-burn',
        DARKEN: 'darken',
        LIGHTEN: 'lighten',
        DIFFERENCE: 'difference',
        EXCLUSION: 'exclusion',
        HUE: 'hue',
        SATURATION: 'saturation',
        LUMINOSITY: 'luminosity',
        COLOR: 'color',
        ADD: 'add',
        SUBTRACT: 'subtract',
        AVERAGE: 'average',
        PIN_LIGHT: 'pin-light',
        NEGATION: 'negation',
        SOURCE_OVER: 'source-over',
        SOURCE_IN: 'source-in',
        SOURCE_OUT: 'source-out',
        SOURCE_ATOP: 'source-atop',
        DESTINATION_OVER: 'destination-over',
        DESTINATION_IN: 'destination-in',
        DESTINATION_OUT: 'destination-out',
        DESTINATION_ATOP: 'destination-atop',
        LIGHTER: 'lighter',
        DARKER: 'darker',
        COPY: 'copy',
        XOR: 'xor'
    };
    
    window.BlendModes = BlendModes;
}());