var spice_display = $("#spice_display");

//the div exists
if (spice_display.is(':visible')) {
    spice_display.animate({
        right: "30px"
    }, 200).animate({
        right: "-330px"
    }, 300, function() {
        spice_display.hide(); 
             
        stopListening();
    });
} else if (spice_display.is(':hidden')) {
    spice_display.show();
    spice_display.animate({
        right: "-300px"
    }, 0).animate({
        right: "30px"
    }, 300).animate({
        right: "15px"
    }, 200);
        
    listen();
}

//theres no div yet
else {

    //add css for our display
    var stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = chrome.extension.getURL('../styles/main.css');
    document.head.appendChild(stylesheet);

    //add markup
    $("body").append("<div id='spice_display' class='shakeIt'><div id='spice_microphone'></div> <div id='spice_sentence'></div> <div id='spice_history'></div> <div id='spice_done'></div></div>");

    spice_display.css({
        right: "-330px"
    });
    spice_display.show();
    spice_display.animate({
        right: "-300px"
    }, 0).animate({
        right: "30px"
    }, 300).animate({
        right: "15px"
    }, 200);

    listen();
}

function listen() {

	Spice.init();
}

function stopListening() {

    Spice.stopListening();
}