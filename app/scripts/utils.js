SpiceUtils = {

    /*
     * Gets a string and
     */
    stringToColor: function(string, ref) {

        switch(string) {
            case "brighter":
            case "lighter":
                return "#FFFFFF";
                break;
            case "darker":
                return "#000000";
                break;
            default:
                return string;
                break;
        }
    },

    isColor: function(string) {
        var colors = ["red", "blue", "green", "yellow", "white", "orange", "black", "purple", "pink", "silver", "gray", "magenta", "cyan", "lime", "teal"];
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
        var alignment = ["center", "middle", "left", "right"];
        return (alignment.indexOf(string) !== -1);
    }
};