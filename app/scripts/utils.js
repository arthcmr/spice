SpiceUtils = {

    /*
     * Gets a string and
     */
    stringToColor: function(string, currentHex, ref) {

        switch(string) {
            case "brighter":

                return this.colorLuminance(currentHex, 0.5);
                break;

            case "lighter":
        
                return this.colorLuminance(currentHex, 0.5);
                break;

            case "darker":
                
                return this.colorLuminance(currentHex, -0.5);
                break;

            default:
                return string;
                break;
        }
    },

    colorLuminance: function(hex, lum) {

        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        lum = lum || 0;

        //change luminosity
        var newHex = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i*2,2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            newHex += ("00"+c).substr(c.length);
        }

        return newHex;
    },

    isColor: function(string) {
        var colors = ["red", "blue", "green", "yellow", "white", "orange", "black", "purple", "pink", "silver", "gray", "magenta", "cyan", "lime", "teal", "darker", "brighter", "lighter"];
        return (colors.indexOf(string) !== -1);
    },

    isSize: function(string) {
        var sizes = ["bigger", "larger", "large", "smaller", "big", "small", "increase", "decrease"];
        return (sizes.indexOf(string) !== -1);
    },

    isFontWeight: function(string) {
        var weight = ["bold", "normal"];
        return (weight.indexOf(string) !== -1);
    },

    isFontStyle: function(string) {
        var styles = ["italics", "normal", "oblique"];
        return (styles.indexOf(string) !== -1);
    },

    isAligned: function(string) {
        var alignment = ["center", "middle", "left", "right", "justify"];
        return (alignment.indexOf(string) !== -1);
    }
};