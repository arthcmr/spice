Spice = {
    sentence: "",
    interval: 3000,
    timer: 0,

    init: function() {

        //in case theres no webkitSpeech
        if (!('webkitSpeechRecognition' in window)) {
            $('#spice_display').html("This browser is not supported. Use a newer version of Google Chrome.");
        }
        //we can use speech recognition
        else {
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
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
                    $('#spice_sentence').html(this.sentence);
                }

                if (final_sentence) {
                    $('#spice_history').html(this.sentence);
                    this.processSentence(this.sentence);
                    //then we send to wit
                    this.sentence = "";
                    $('#spice_sentence').html("");
                }

            }.bind(this);

            //if theres an error, start over
            recognition.onend = function(evt) {
                console.log("Restarting speech recognition");
                recognition.start();
            };

            recognition.start();
        }
    },

    isNewSentence: function() {
        var tmpTime = new Date().getTime();
        if (tmpTime - this.timer > this.interval) {
            this.timer = tmpTime;
            return true;
        } else return false;
    },

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

            $('#spice_done').html($('#spice_history').html());
            $('#spice_history').html("");
        });
    },



    /*
     * gets the wit response and interprets its fields into Spice actions
     */
    interpretWit: function(wit_response) {
        var command = {
            action: "",
            target: "",
            value: ""
        };

        var response = wit_response.outcomes[0];

        //check confidence
        if(response.confidence > 0.7) {
            switch(response.intent) {
                case "paragraph":
                    var target = $("p"),
                        value,
                        action;
                    if(response.entities.ordinal && response.entities.ordinal.length) {
                        var order = response.entities.ordinal[0].value - 1;
                        target = $("p:eq("+order+")");
                    }
                    if(response.entities.agenda_entry && response.entities.agenda_entry.length) {
                        var entry = response.entities.agenda_entry[0].value;
                        if(entry === "remove") {
                            action = "remove";
                        }
                        else if (SpiceUtils.isColor(entry)) {
                            action = "changeFontColor";
                            value = entry;
                        }
                        else if (SpiceUtils.isSize(entry)) {
                            action = "changeFontSize";
                            value = entry;
                        }

                        command.action = action;
                        command.target = target;
                        command.value = value;
                    }
                break;
                case "background":
                    var target = $("body"),
                        value,
                        action;
                    if(response.entities.agenda_entry && response.entities.agenda_entry.length) {
                        var entry = response.entities.agenda_entry[0].value;
                        action = "changeBackgroundColor";
                        value = entry;
                        command.action = action;
                        command.target = target;
                        command.value = value;
                    }
                break;
            }
        }

        //intent

        //value

        return command;
    },

    /*
     * receives a command object and performs the action
     */
    executeCommand: function(command) {
        console.log("Trying to execute command", command);

        if(!command.action) {
            console.log("We could not understand you");
            return;
        }

        this[command.action](command.target, command.value);
    },

    changeBackgroundColor: function(target, value) {
        console.log("Trying to change the background");

        var color = SpiceUtils.stringToColor(value, target.css('backgroundColor'));
        target.css('backgroundColor', color);
    },

    changeFontColor: function(target, value) {
        console.log("Trying to change the font color");
        var color = SpiceUtils.stringToColor(value, target.css('color'));
        target.css('color', color);
    },

    changeFontSize: function(target, value) {

    }

};