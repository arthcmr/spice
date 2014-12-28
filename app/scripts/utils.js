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
        var colors = ["red", "blue", "green", "yellow", "white", "orange"];
        return (colors.indexOf(string) !== -1);
    },

    isSize: function(string) {
        var sizes = ["bigger", "larger", "large", "smaller", "big", "small", "increase", "decrease"];
        return (sizes.indexOf(string) !== -1);
    }
};