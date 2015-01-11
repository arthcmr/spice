Spice = {
    sentence: "",
    interval: 3000,
    timer: 0,
    recog: null,
    start_player: null,
    stop_player: null,

    init: function() {

        //in case theres no webkitSpeech
        if (!('webkitSpeechRecognition' in window)) {
            $('#spice_display').html("This browser is not supported. Use a newer version of Google Chrome.");
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
            
            console.log('Listening Started...');
            
            recognition.start();
    
        }
    },

    stopListening: function()
    {
        console.log('Listening Stopped...');
        recog.abort();
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
                            target.css('-webkit-transition', 'color 1s ease-out');
                            value = entry;
                        }
                        else if (SpiceUtils.isSize(entry)) {
                            action = "changeFontSize";
                            target.css('-webkit-transition', 'font-size 1s');
                            value = entry;
                        }
                        else if(SpiceUtils.isAligned(entry)) {                            
                            action = "align";

                            value = entry;
                        }
                        else if(entry === "remove" || entry === "delete" || entry === "get rid of") {                            
                            action = "removeElement";
                            value = entry;
                        }
                        else if(entry === "hide") {                            
                            action = "hideElement";
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
                        target.css('-webkit-transition', 'background-color 1s ease-out');
                        value = entry;
                        command.action = action;
                        command.target = target;
                        command.value = value;
                    }
                break;
                case "title":
                    var target = $("h1"),
                        value,
                        action;
                    if(response.entities.agenda_entry && response.entities.agenda_entry.length) {
                        var entry = response.entities.agenda_entry[0].value;
                        if(SpiceUtils.isFontWeight(entry)) {
                            action = "changeFontWeight";
                            value = entry;
                        }
                        else if (SpiceUtils.isColor(entry)) {
                            action = "changeFontColor";
                            target.css('-webkit-transition', 'color 1s ease-out');
                            value = entry;
                        }
                        else if (SpiceUtils.isSize(entry)) {
                            action = "changeFontSize";
                            target.css('-webkit-transition', 'font-size 1s');
                            value = entry;
                        }
                        else if(SpiceUtils.isFontStyle(entry)) {
                            //PROBLEM WHEN SAYING ITALICS
                            action = "changeFontStyle";
                            value = entry;
                        }
                        else if(SpiceUtils.isAligned(entry)) {                            
                            action = "align";
                            value = entry;
                        }
                        else if(entry === "remove" || entry === "delete" || entry === "get rid of") {                            
                            action = "removeElement";
                            //Not working !!!
                            target.css('-webkit-animation', 'fadeOut 500ms');                            
                            value = entry;
                        }
                        else if(entry === "hide") {                            
                            action = "hideElement";
                            //Not working !!!
                            target.css('-webkit-animation', 'fadeOut 500ms');
                            value = entry;
                        }
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
            stop_player.play();
            return;
        }

        start_player.play();
        this[command.action](command.target, command.value);
    },

    changeBackgroundColor: function(target, value) {
        console.log("Trying to change the background");

        if(value === "lighter" || value === "darker" || value === "brighter")
        {
            var currentRgb = target.css("backgroundColor");

            var currentHex = this.rgb2hex(currentRgb);
        }

        var color = SpiceUtils.stringToColor(value, currentHex, target.css('backgroundColor'));
        target.css('backgroundColor', color);
    },

    changeFontColor: function(target, value) {
        console.log("Trying to change the font color");

        if(value === "lighter" || value === "darker" || value === "brighter")
        {
            var currentRgb = target.css("color");

            var currentHex = this.rgb2hex(currentRgb);
        }

        var color = SpiceUtils.stringToColor(value, currentHex, target.css('color'));
        target.css('color', color);
    },

    changeFontSize: function(target, value) {
        //INCREASE NOT WORKING !!!
        console.log("Trying to change font size");
        if(value === "bigger" || value === "larger" || value === "increase"){            
            var currentFont = parseInt(target.css('font-size'));            
            var fontToSet = currentFont + 15;
            var finalFont = fontToSet.toString();                    
            target.css('font-size', finalFont.concat("px"));
            //Not Done !!!
            //target.css('backgroundColor', 'gray');            
        }
        else if (value === "smaller" || value === "decrease"){
        if(value === "smaller" || value === "decrease"){
            var currentFont = parseInt(target.css('font-size'));            
            var fontToSet = currentFont - 15;
            var finalFont = fontToSet.toString();                    
            target.css('font-size', finalFont.concat("px"));
            }
        } 
        else if(value === "small" ){                    
            target.css('font-size', "medium");
        }   
        else if(value === "large" ){                    
            target.css('font-size', "x-large");
        }     
        else
        {
            //exact number for the font size (pixels) - TO BE IMPLEMENTED
            target.css('font-size', value);
        }   
    },

    changeFontWeight: function(target, value) {
        // bold
        console.log("Changing Font Weight");
        target.css('font-weight', value);
    },

    changeFontStyle: function(target, value) {
        //italics, normal, oblique
        console.log("Changing Font Style");
        target.css('font-style', value);
    },

    align: function(target, value) {        
        console.log("Aligning Text");
        if(value === "center" || value === "middle")
        {
            target.css('text-align', "center");
        }
        else if (value === "left")
        {
            target.css('text-align', value);
        }
        else if (value === "right")
        {
            target.css('text-align', value);
        } 
        else if (value === "justify")
        {
            target.css('text-align', "justify");
        } 
    },

    removeElement: function(target, value){        
        console.log("Removing Element");        
        target.css('display', "none");
    },

    hideElement: function(target, value){    
        console.log("Hiding Element");        
        target.css('visibility', "hidden");
    },

    //Function to convert rgb format to a hex color
    rgb2hex: function(rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    }

};