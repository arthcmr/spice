/*
 * Spice module
 */

Spice = {

    //Spice variables
    sentence: "",
    interval: 3000,
    timer: 0,
    recog: null,
    start_player: null,
    stop_player: null,
    p_action: "",
    p_target: "",
    p_value: "",
    p_intent: "",
    p_ordinal: null,
    it_flag: 0,
    hover_element: null,

    /*
     * Initializes spice
     */

    init: function() {

        //in case theres no webkitSpeech
        if (!('webkitSpeechRecognition' in window)) {
            $('#spice-display').html("This browser is not supported. Use a newer version of Google Chrome.");
        }
        //we can use speech recognition
        else {
            var recognition = new webkitSpeechRecognition();
            recog = recognition;
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            start_player = document.createElement('audio');
            start_player.id = "short_audio1";
            start_player.src = chrome.extension.getURL("../sounds/success.mp3");
            start_player.type = "audio/mpeg";
            document.body.appendChild(start_player);

            stop_player = document.createElement('audio');
            stop_player.id = "short_audio1";
            stop_player.src = chrome.extension.getURL("../sounds/reject.mp3");
            stop_player.type = "audio/mpeg";
            document.body.appendChild(stop_player);

            recognition.onresult = function(evt) {

                var final_sentence = false;

                if (this.isNewSentence()) {
                    this.sentence = "";
                }

                //get the sentence
                var sentence = "";
                for (var i = evt.resultIndex; i < evt.results.length; ++i) {
                    if (evt.results[i].isFinal) {
                        final_sentence = true;
                    }
                    sentence += evt.results[i][0].transcript;
                }
                this.sentence = sentence;

                if (this.sentence !== "") {
                    $('#spice-sentence').html(this.sentence);
                }

                if (final_sentence) {
                    $('#spice-history').html(this.sentence);
                    this.processSentence(this.sentence);
                    //then we send to wit
                    this.sentence = "";
                    $('#spice-sentence').html("");
                }

            }.bind(this);

            /*  
                I think that recognition.onend is not really necessary. It works good without it. When the Spice icon
                is pressed it goes into this branch and it keeps executing it like in a while loop (and we have to 
                restart the whole web page).

                Correct me if I'm wrong, but I think that we are good without it.  
                P.S. Stop Listening works without recognition.onend. When I uncomment it, it goes in endless loop.
            */

            /*//if theres an error, start over
            recognition.onend = function(evt) {
                console.log("Restarting speech recognition");                
                recognition.start();
            };*/


            //start voice recognition
            recognition.start();
            console.log('Listening Started...');

            //capture mouse target at all times
            var _this = this;
            $('html').on('mousemove', function(evt) {

                //if hovering the spice elements, do not recognize it
                _this.hover_element = $(evt.toElement);

                if (_this.hover_element.attr("id") === 'spice-display' || _this.hover_element.attr("id") === '#spice-intro' || _this.hover_element.parents('#spice-display').length || _this.hover_element.parents('#spice-intro').length) {

                    _this.hover_element = undefined
                    $('.spice-hovered').removeClass('spice-hovered');

                }
                //otherwise, color it
                else if (!_this.hover_element.hasClass('spice-hovered')) {

                    $('.spice-hovered').removeClass('spice-hovered');
                    _this.hover_element.addClass('spice-hovered');

                }
            });
        }
    },

    /*
     * stops listening for user input
     */
    stopListening: function() {
        console.log('Listening Stopped...');
        recog.abort();
    },

    /*
     * Checks whether the user has started a new sentence
     */
    isNewSentence: function() {
        var tmpTime = new Date().getTime();
        if (tmpTime - this.timer > this.interval) {
            this.timer = tmpTime;
            return true;
        } else return false;
    },

    /*
     * Sends user sentence to wit.ai
     * @param {String} sentence the sentence the user spoke
     */
    processSentence: function(sentence) {
        var pars = {
            'q': sentence,
            'access_token': 'ON2AFGRMYDTT2NTF4R2X6IXNGIFSFUJD'
        };

        var _this = this;
        $.getJSON('https://api.wit.ai/message', pars, function(response) {
            console.log("WIT RESPONSE:");
            console.log(response);

            _this.executeCommand(_this.interpretWit(response));

            $('#spice-done').html($('#spice-history').html());
            $('#spice-history').html("");
        });
    },

    /*
     * gets the wit response and interprets its fields into Spice actions
     * @param {Object} wit_response response from wit.ai
     * @returns {Object} the command to be executed by Spice
     */
    interpretWit: function(wit_response) {
        var command = {
            action: "",
            target: "",
            value: ""
        };

        var response = wit_response.outcomes[0];
        it_flag = 0;
        //check confidence
        if (response.confidence > 0.7) {
            if (response.intent === "it") {
                response.intent = this.p_intent;
                it_flag = 1;
            }
            var intent = response.intent,
                target = this.findTarget(response, wit_response._text);

            /*
             * Figure out intent in case of this
             */
            if (intent === "this") {
                var target_tag = target.prop("tagName");
                if (target_tag === "BODY" || target_tag === "HTML") {
                    intent = "background";

                } else {
                    intent = "text";
                }
                this.p_intent = "paragraph";
            }

            /*
             * Paragraph and Title
             */
            if (intent === "paragraph" || intent === "title" || intent === "text") {
                if (intent === "paragraph")
                    this.p_intent = "paragraph";
                else if (intent === "title")
                    this.p_intent = "title";
                else if (intent === "text")
                    this.p_intent = "text";


                if (response.entities.agenda_entry && response.entities.agenda_entry.length) {

                    var actionValue = this.getActionValueText(response);
                    command.target = target;
                    command.action = actionValue.action;
                    command.value = actionValue.value;
                    this.p_action = command.action;
                    this.p_target = target;
                }
            }

            /*
             * Background
             */
            else if (intent === "background") {
                this.p_intent = "background";

                if (response.entities.agenda_entry && response.entities.agenda_entry.length) {

                    var actionValue = this.getActionValueBackground(response);

                    command.target = target;
                    command.action = actionValue.action;
                    command.value = actionValue.value;
                    this.p_action = command.action;
                    this.p_target = target;
                }

            }
            /*
             * Picture
             */
            else if (intent === "picture") {
                this.p_intent = "picture";
                if (response.entities.agenda_entry && response.entities.agenda_entry.length) {

                    var actionValue = this.getActionValuePicture(response);

                    command.target = target;
                    command.action = actionValue.action;
                    command.value = actionValue.value;
                    this.p_action = command.action;
                    this.p_target = target;
                }
            }

            /*
             * Undo
             */
            else if (intent === "undo" || intent === "go back") {

                console.log("Trying to undo");
                if (this.p_action == "hideElement") {
                    console.log("prev hide now show");
                    command.action = "showElement";
                    this.p_action = "showElement"
                } else if (this.p_action == "showElement") {
                    console.log("prev show now hide");
                    command.action = "hideElement";
                    this.p_action = "hideElement"
                } else if (this.p_action == "removeElement") {
                    console.log("prev remove now restore");
                    command.action = "restoreElement";
                    this.p_action = "restoreElement"
                } else if (this.p_action == "restoreElement") {
                    console.log("prev restore now remove");
                    command.action = "removeElement";
                    this.p_action = "removeElement"
                } else {
                    command.action = this.p_action;

                }
                command.target = this.p_target;
                command.value = this.p_value;

            }

        }

        return command;
    },

    /*
     * finds target based on response and sentence
     * @param {Object} response the object with the response config
     * @param {String} sentence the original sentence
     */
    findTarget: function(response, sentence) {

        var intent = response.intent,
            target = null,
            order;
        if (intent === "this") {
            target = this.hover_element;
        }
        // EVERYTHING THAT NEEDS ORDINAL COMES HERE !!!
        else if (intent === "paragraph" || intent === "title" || intent === "picture") {
            switch (intent) {
                case "paragraph":
                    target_tag = "p";
                    break;
                case "title":
                    target_tag = "h1";
                    break;
                case "picture":
                    target_tag = "img";
                    break;
            }
            //get the target based on order
            if (response.entities.ordinal && response.entities.ordinal.length) {
                order = response.entities.ordinal[0].value - 1;
                this.p_ordinal = order;
                target = $(target_tag + ":eq(" + order + ")");
            } else if (it_flag == 0) {
                target = $(target_tag)

            } else if (it_flag == 1 && this.p_ordinal != null) {
                target = $(target_tag + ":eq(" + this.p_ordinal + ")");
            }
        } else if (intent === "background") {
            target = $("body");
        } else if (intent === "text") {
            console.log("i am here");
            this.p_ordinal = null;
            target = $("body");
        }

        return target;

    },

    /*
     * gets the action and the value of text intents in a response
     * @param {Object} response the object with the response config
     * @returns {Object} an object with action, followed by the value
     */
    getActionValueText: function(response) {
        var action, value;

        var entry = response.entities.agenda_entry[0].value;
        if (SpiceUtils.isColor(entry)) {
            action = "changeFontColor";
            value = entry;
        } else if (SpiceUtils.isSize(entry)) {
            action = "changeFontSize";
            value = entry;
        } else if (SpiceUtils.isFontWeight(entry)) {
            action = "changeFontWeight";
            value = entry;
        } else if (SpiceUtils.isFontStyle(entry)) {
            //PROBLEM WHEN SAYING ITALICS
            action = "changeFontStyle";
            value = entry;
        } else if (SpiceUtils.isAligned(entry)) {
            action = "align";
            value = entry;
        } else if (entry === "remove" || entry === "delete" || entry === "get rid of") {
            action = "removeElement";
            value = entry;
        } else if (entry === "hide") {
            action = "hideElement";
            value = entry;
        } else if (entry === "show") {
            console.log("showing");
            action = "showElement";
            value = entry;
        }

        return {
            action: action,
            value: value
        };
    },

    /*
     * gets the action and the value of background intents in a response
     * @param {Object} response the object with the response config
     * @returns {Object} an object with action, followed by the value
     */
    getActionValueBackground: function(response) {
        var action = "changeBackgroundColor";
        var value = response.entities.agenda_entry[0].value;

        return {
            action: action,
            value: value
        };
    },

    /*
     * gets the action and the value of picture intents in a response
     * @param {Object} response the object with the response config
     * @returns {Object} an object with action, followed by the value
     */
    getActionValuePicture: function(response) {
        var action = "changePicture";
        var value = response.entities.agenda_entry[0].value;

        if (value === "hide") {
            action = "hideElement";
        } else if (value === "remove" || value === "delete" || value === "get rid of") {
            action = "removeElement";
        } else if (value === "show") {
            action = "showElement";
        }

        return {
            action: action,
            value: value
        };
    },

    /*
     * executes a spice command
     * @param {Object} command the spice formatted command
     */
    executeCommand: function(command) {
        console.log("Trying to execute command", command);
        console.log("order=", this.p_ordinal);
        if (!command.action) {
            console.log("We could not understand you");

            this.shakeAnimation();

            stop_player.play();
            return;
        }

        start_player.play();

        $('#spice-display').removeClass('spice-error');
        $('#spice-display').addClass('spice-success');

        this[command.action](command.target, command.value);
    },

    /*
     * shakes the spice display
     */
    shakeAnimation: function() {

        element = $("#spice-display");
        element.addClass('spice-error');
        element.removeClass('spice-success');
        element.removeClass("spice-shakeIt");
        setTimeout(function() {
            element.addClass("spice-shakeIt");
        }, 1);
    },

    /*
     * changes the background to a certain color
     * @param {Object} target the jquery object with the target
     * @param {String} value the new value
     */
    changeBackgroundColor: function(target, value) {
        console.log("Trying to change the background");
        this.p_value = target.css("backgroundColor");

        target.css('-webkit-transition', 'background-color 1s ease-out');

        if (value === "lighter" || value === "darker" || value === "brighter") {
            var currentRgb = target.css("backgroundColor");

            var currentHex = SpiceUtils.rgb2hex(currentRgb);
        }

        var color = SpiceUtils.stringToColor(value, currentHex, target.css('backgroundColor'));
        target.css('backgroundColor', color);
    },

    /*
     * changes the size of pictures
     * @param {Object} target the jquery object with the target
     * @param {String} value the new size
     */
    changePicture: function(target, value) {
        console.log("Trying to change the picture");
        this.p_value = target.width();
        var multiplier = 1;


        console.log(value);

        if (SpiceUtils.isSize(value)) {
            if (value === "bigger" || value === "larger" || value === "increase") {
                multiplier = 1.25;
            } else if (value === "smaller" || value === "decrease" || value === "small") {
                multiplier = 0.75;
            }
            var width = parseInt(target.width()) * multiplier;
            var height = parseInt(target.height()) * multiplier;
            target.width(width);
            target.height(height);
        }

    },

    /*
     * changes the font to a certain color
     * @param {Object} target the jquery object with the target
     * @param {String} value the new color
     */
    changeFontColor: function(target, value) {
        console.log("Trying to change the font color");
        this.p_value = target.css("color");

        target.css('-webkit-transition', 'color 1s ease-out');

        if (value === "lighter" || value === "darker" || value === "brighter") {
            var currentRgb = target.css("color");

            var currentHex = SpiceUtils.rgb2hex(currentRgb);
        }

        var color = SpiceUtils.stringToColor(value, currentHex, target.css('color'));
        target.css('color', color);
    },

    /*
     * changes the font to a different size
     * @param {Object} target the jquery object with the target
     * @param {String} value the new size
     */
    changeFontSize: function(target, value) {
        //INCREASE NOT WORKING !!!
        console.log("Trying to change font size");
        this.p_value = target.css("font-size");
        if (value === "bigger" || value === "larger" || value === "increase") {
            var currentFont = parseInt(target.css('font-size'));
            var fontToSet = currentFont + 4;
            var finalFont = fontToSet.toString();
            target.css('font-size', finalFont.concat("px"));
        } else if (value === "smaller" || value === "decrease") {
            if (value === "smaller" || value === "decrease") {
                var currentFont = parseInt(target.css('font-size'));
                var fontToSet = currentFont - 4;
                var finalFont = fontToSet.toString();
                target.css('font-size', finalFont.concat("px"));
            }
        } else if (value === "small") {
            target.css('font-size', "medium");
        } else if (value === "large") {
            target.css('font-size', "x-large");
        } else {
            //exact number for the font size (pixels) - TO BE IMPLEMENTED
            target.css('font-size', value);
        }

        target.css('-webkit-transition', 'font-size 1s ease-out');
    },

    /*
     * changes the font to a different weight
     * @param {Object} target the jquery object with the target
     * @param {String} value the new weight
     */
    changeFontWeight: function(target, value) {
        // bold
        console.log("Changing Font Weight");
        this.p_value = target.css("font-weight");
        target.css('font-weight', value);
    },

    /*
     * changes the font to a different style
     * @param {Object} target the jquery object with the target
     * @param {String} value the new style
     */
    changeFontStyle: function(target, value) {
        //italics, normal, oblique
        console.log("Changing Font Style");
        this.p_value = target.css("font-style");
        target.css('font-style', value);
    },

    /*
     * aligns text to one of the 4 possible alignments
     * @param {Object} target the jquery object with the target
     * @param {String} value the new alignment
     */
    align: function(target, value) {
        console.log("Aligning Text");
        this.p_value = target.css("text-align");
        if (value === "center" || value === "middle") {
            target.css('text-align', "center");
        } else if (value === "left") {
            target.css('text-align', value);
        } else if (value === "right") {
            target.css('text-align', value);
        } else if (value === "justify") {
            target.css('text-align', "justify");
        }
    },

    /*
     * removes an element
     * @param {Object} target the jquery object with the target
     */
    removeElement: function(target) {
        console.log("Removing Element");
        target.css('display', "none");
    },

    /*
     * hides an element
     * @param {Object} target the jquery object with the target
     */
    hideElement: function(target) {
        console.log("Hiding Element");
        target.css('display', "none");
    },

    /*
     * shows an element
     * @param {Object} target the jquery object with the target
     */
    showElement: function(target) {
        if (target.css("visibility") == "hidden") {
            console.log("Showing Element");
            target.css('visibility', "visible");
        } else {
            console.log("Restoring Element");
            target.css('display', "block");
            this.p_action = "restoreElement"
        }
    },

    /*
     * restores an element
     * @param {Object} target the jquery object with the target
     */
    restoreElement: function(target, value) {
        console.log("Restoring Element");
        target.css('display', "block");
    }

};