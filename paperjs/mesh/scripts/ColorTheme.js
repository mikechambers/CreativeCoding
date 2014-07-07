(function () {
    "use strict";

    function ColorTheme(theme) {
        this.theme = theme;
    }

    ColorTheme.prototype.getRandomColor = function () {
        return this.theme[Math.floor(Math.random() * this.theme.length)];
    };

    ColorTheme.prototype.getNextColor = function () {
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
    
        FOREVER_LOSTS: [
            '#5D4157', '#838689', '#A8CABA', '#CAD7B2', '#EBE3AA'
        ],
    
        GRAY: [
            "#666666"
        ]
    };
    
    window.ColorTheme = ColorTheme;
}());