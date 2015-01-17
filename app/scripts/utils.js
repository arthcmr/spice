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
                return string;
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
        var colors = ["red", "blue", "green", "yellow", "white", "orange", "black", "purple", "pink", "silver", "gray", "magenta", "cyan", "lime", "teal", "darker", "brighter", "lighter"];
        return (colors.indexOf(string) !== -1);
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
    }
};