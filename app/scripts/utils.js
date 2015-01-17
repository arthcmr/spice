/*
 * Utility functions
 */

SpiceUtils = {

    /*
     * Gets a string and makes it brighter or darker
     * @param {String} string action we want to perform
     * @param {String} currentHex HEX formatted color
     * @returns {String} hex HEX formatted color
     */
    stringToColor: function(string, currentHex, ref) {

        switch (string) {
            case "brighter":

                return this.colorLuminance(currentHex, 0.2);
                break;

            case "lighter":

                return this.colorLuminance(currentHex, 0.2);
                break;

            case "darker":
                return this.colorLuminance(currentHex, -0.2);
                break;

            default:
                return this.getRandomColor(string);
                break;
        }
    },

    /*
     * converts RGB into HEX format
     * @param {String} rgb RGB formatted color
     * @returns {String} hex HEX formatted color
     */
    rgb2hex: function(rgb) {
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    },

    /*
     * changes the luminance of a color
     * @param {String} hex HEX formatted color
     * @param {Number} lum value of luminance between 0 and 1
     * @returns {string} hex HEX formatted color
     */
    colorLuminance: function(hex, lum) {

        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;

        //change luminosity
        var newHex = "#",
            c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            newHex += ("00" + c).substr(c.length);
        }

        return newHex;
    },

    /*
     * checks whether a string is a color
     * @param {String} string string to be checked
     * @returns {Boolean} isColor
     */
    isColor: function(string) {
        string = string.toLowerCase().split(' ').join('');
        return (typeof this.colors[string] !== 'undefined');
    },

    /*
     * gets a specific color from the colors array
     */
    getColor: function(string) {
        string = string.toLowerCase().split(' ').join('');
        return this.colors[string];
    },

    /*
     * gets a random color based on the string provided
     */
    getRandomColor: function(string) {
        string = string.toLowerCase().split(' ').join('');
        var color;
        try {

            if (string === "black") {
                color = this.getColor(string);
            } else if (string === "white") {
                color = this.getColor(string);
            } else if (string === "grey") {
                color = Please.make_color({
                    grayscale: true,  //for the yanks,
                    golden: false
                });
            } else {
                color = Please.make_color({
                    golden: false,
                    base_color: string
                });
            }
        } catch (e) {
            console.log(Please);
            console.log("Couldn't recognize the color: " + string);
            color = undefined;
        }
        return color;
    },

    /*
     * checks whether a string is a valid size
     * @param {String} string string to be checked
     * @returns {Boolean} isSize
     */
    isSize: function(string) {
        var sizes = ["bigger", "larger", "large", "smaller", "big", "small", "increase", "decrease"];
        return (sizes.indexOf(string) !== -1);
    },

    /*
     * checks whether a string is a valid font weight
     * @param {String} string string to be checked
     * @returns {Boolean} isFontWeight
     */
    isFontWeight: function(string) {
        var weight = ["bold", "normal"];
        return (weight.indexOf(string) !== -1);
    },

    /*
     * checks whether a string is a valid font style
     * @param {String} string string to be checked
     * @returns {Boolean} isFontStyle
     */
    isFontStyle: function(string) {
        var styles = ["italics", "normal", "oblique"];
        return (styles.indexOf(string) !== -1);
    },

    /*
     * checks whether a string is a valid alignment
     * @param {String} string string to be checked
     * @returns {Boolean} isAligned
     */
    isAligned: function(string) {
        var alignment = ["center", "middle", "left", "right", "justify"];
        return (alignment.indexOf(string) !== -1);
    },

    /*
     * list of recognizable colors
     */
    colors: {
        aliceblue: "#F0F8FF",
        antiquewhite: "#FAEBD7",
        aqua: "#7FDBFF",
        aquamarine: "#7FFFD4",
        azure: "#F0FFFF",
        beige: "#F5F5DC",
        bisque: "#FFE4C4",
        black: "#222222",
        blanchedalmond: "#FFEBCD",
        blue: "#0074D9",
        blueviolet: "#8A2BE2",
        brown: "#A52A2A",
        burlywood: "#DEB887",
        cadetblue: "#5F9EA0",
        chartreuse: "#7FFF00",
        chocolate: "#D2691E",
        coral: "#FF7F50",
        cornflowerblue: "#6495ED",
        cornsilk: "#FFF8DC",
        crimson: "#DC143C",
        cyan: "#00FFFF",
        darkblue: "#00008B",
        darkcyan: "#008B8B",
        darkgoldenrod: "#B8860B",
        darkgray: "#A9A9A9",
        darkgrey: "#A9A9A9",
        darkgreen: "#006400",
        darkkhaki: "#BDB76B",
        darkmagenta: "#8B008B",
        darkolivegreen: "#556B2F",
        darkorange: "#FF8C00",
        darkorchid: "#9932CC",
        darkred: "#8B0000",
        darksalmon: "#E9967A",
        darkseagreen: "#8FBC8F",
        darkslateblue: "#483D8B",
        darkslategray: "#2F4F4F",
        darkslategrey: "#2F4F4F",
        darkturquoise: "#00CED1",
        darkviolet: "#9400D3",
        deeppink: "#FF1493",
        deepskyblue: "#00BFFF",
        dimgray: "#696969",
        dimgrey: "#696969",
        dodgerblue: "#1E90FF",
        firebrick: "#B22222",
        floralwhite: "#FFFAF0",
        forestgreen: "#228B22",
        fuchsia: "#FF00FF",
        gainsboro: "#DCDCDC",
        ghostwhite: "#F8F8FF",
        gold: "#FFD700",
        goldenrod: "#DAA520",
        gray: "#AAAAAA",
        grey: "#AAAAAA",
        green: "#2ECC40",
        greenyellow: "#ADFF2F",
        honeydew: "#F0FFF0",
        hotpink: "#FF69B4",
        indianred: "#CD5C5C",
        indigo: "#4B0082",
        ivory: "#FFFFF0",
        khaki: "#F0E68C",
        lavender: "#E6E6FA",
        lavenderblush: "#FFF0F5",
        lawngreen: "#7CFC00",
        lemonchiffon: "#FFFACD",
        lightblue: "#ADD8E6",
        lightcoral: "#F08080",
        lightcyan: "#E0FFFF",
        lightgoldenrodyellow: "#FAFAD2",
        lightgray: "#D3D3D3",
        lightgrey: "#D3D3D3",
        lightgreen: "#90EE90",
        lightpink: "#FFB6C1",
        lightsalmon: "#FFA07A",
        lightseagreen: "#20B2AA",
        lightskyblue: "#87CEFA",
        lightslategray: "#778899",
        lightslategrey: "#778899",
        lightsteelblue: "#B0C4DE",
        lightyellow: "#FFFFE0",
        lime: "#01FF70",
        limegreen: "#32CD32",
        linen: "#FAF0E6",
        magenta: "#FF00FF",
        maroon: "#85144B",
        mediumaquamarine: "#66CDAA",
        mediumblue: "#0000CD",
        mediumorchid: "#BA55D3",
        mediumpurple: "#9370D8",
        mediumseagreen: "#3CB371",
        mediumslateblue: "#7B68EE",
        mediumspringgreen: "#00FA9A",
        mediumturquoise: "#48D1CC",
        mediumvioletred: "#C71585",
        midnightblue: "#191970",
        mintcream: "#F5FFFA",
        mistyrose: "#FFE4E1",
        moccasin: "#FFE4B5",
        navajowhite: "#FFDEAD",
        navy: "#001F3F",
        oldlace: "#FDF5E6",
        olive: "#3D9970",
        olivedrab: "#6B8E23",
        orange: "#FF851B",
        orangered: "#FF4500",
        orchid: "#DA70D6",
        palegoldenrod: "#EEE8AA",
        palegreen: "#98FB98",
        paleturquoise: "#AFEEEE",
        palevioletred: "#D87093",
        papayawhip: "#FFEFD5",
        peachpuff: "#FFDAB9",
        peru: "#CD853F",
        pink: "#F012BE",
        plum: "#DDA0DD",
        powderblue: "#B0E0E6",
        purple: "#B10DC9",
        rebeccapurple: "#663399",
        red: "#FF4136",
        rosybrown: "#BC8F8F",
        royalblue: "#4169E1",
        saddlebrown: "#8B4513",
        salmon: "#FA8072",
        sandybrown: "#F4A460",
        seagreen: "#2E8B57",
        seashell: "#FFF5EE",
        sienna: "#A0522D",
        silver: "#DDDDDD",
        skyblue: "#87CEEB",
        slateblue: "#6A5ACD",
        slategray: "#708090",
        slategrey: "#708090",
        snow: "#FFFAFA",
        springgreen: "#00FF7F",
        steelblue: "#4682B4",
        tan: "#D2B48C",
        teal: "#39CCCC",
        thistle: "#D8BFD8",
        tomato: "#FF6347",
        turquoise: "#40E0D0",
        violet: "#EE82EE",
        wheat: "#F5DEB3",
        white: "#FFFFFF",
        whitesmoke: "#F5F5F5",
        yellow: "#FFDC00",
        yellowgreen: "#9ACD32"
    },

    primaryColors: ['aqua', 'blue', 'navy', 'teal', 'olive', 'green', 'lime', 'yellow', 'orange', 'red', 'maroon', 'pink', 'purple', 'black', 'silver', 'gray', 'white']
};