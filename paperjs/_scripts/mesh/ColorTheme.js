/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */

(function () {
    "use strict";

    function ColorTheme(theme) {
        this.theme = theme;
        this.colorIndex = 0;
    }

    ColorTheme.prototype.getRandomColor = function () {
        return this.theme[Math.floor(Math.random() * this.theme.length)];
    };

    ColorTheme.prototype.getNextColor = function () {
        
        this.colorIndex++;
        
        if (this.colorIndex === this.theme.length) {
            this.colorIndex = 0;
        }
        
        return this.theme[this.colorIndex];
    };

    
    ColorTheme.themes = {
    
        BLUE: [
            "#001B2B",
            "#18415C",
            "#387BA8",
            "#4CA3D9",
            "#76DAF5"
        ],
    
        RAINBOW: [
            "#FF0012",
            "#FF7D00",
            "#FFD900",
            "#5BE300",
            "#0084B0"
        ],
    
        SVENSKAS: [
            "#BC2430",
            "#00A47A",
            "#73BE9F",
            "#3E1303",
            "#C1372C"
        ],
    
        BLUE_AND_PINK: [
            "#006F94",
            "#92CDCD",
            "#FEF2D8",
            "#F18C79",
            "#DB4948"
        ],
        
        CROSSWALK: [
            "#EFC63A",
            "#EFAE33",
            "#BF4707",
            "#7C0706",
            "#EF281E"
        ],
    
        PHAEDRA: [
            "#FF6138",
            "#FFFF9D",
            "#BEEB9F",
            "#79BD8F",
            "#00A388"
        ],
        
        FOREVER_LOSTS: [
            '#5D4157', '#838689', '#A8CABA', '#CAD7B2', '#EBE3AA'
        ],
        
        ONLY_HUMAN: [
            "#E0FFB3",
            "#61C791",
            "#31797D",
            "#2A2F36",
            "#F23C55"
        ],

        TOKYO_TRACK: [
            "#A4727E",
            "#D1DA96",
            "#A4A877",
            "#A8896F",
            "#A4776B"
        ],     

        TOKYO_ALLEY: [
            "#A83151",
            "#722037",
            "#263A5A",
            "#C3E8F2",
            "#F0CC7D"
        ],      
        
        BLUE_GREY: [
            "#E6F1F5",
            "#636769",
            "#AAB3B6",
            "#6E7476",
            "#4B4E50"
        ],
        
        POST_ASTEROID_ENVIRONMENT: [
            "#8A1700",
	       "#FF5600",
	       "#FCFFF8",
	       "#8ACCE8",
	       "#273A42"
        ],
    
        GRAY: [
            "#666666"
        ],

        GRAY_SCALE: [
            "#222222",
            "#333333",
            "#444444",
            "#555555",
            "#666666"
        ]


    };
    
    window.ColorTheme = ColorTheme;
}());