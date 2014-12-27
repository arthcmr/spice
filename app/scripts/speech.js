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

                if(final_sentence) {
                    $('#spice_history').html(this.sentence);
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
    }
};