var spice_display = $("#spice_display");
var spice_intro;

var showBox = function(){

if (spice_intro && spice_intro.is(':visible')) {
    spice_intro.animate({
        left: "30px"
    }, 200).animate({
        left: "-330px"
    }, 300, function() {
        spice_intro.hide(); 
             
    });
} else if (spice_intro && spice_intro.is(':hidden')) {
    spice_intro.show();
    spice_intro.animate({
        left: "-300px"
    }, 0).animate({
        left: "30px"
    }, 300).animate({
        left: "15px"
    }, 200);
        
}
//theres no div yet
else {

    //add markup    
    $("body").append("<div id='spice_intro'>Welcome</div>");
    spice_intro = $("#spice_intro");
    spice_intro.css({
        left: "-330px"
    });
    spice_intro.show();
    spice_intro.animate({
        left: "-300px"
    }, 0).animate({
        left: "30px"
    }, 300).animate({
        left: "15px"
    }, 200);
    
    }

}

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
    $("body").append("<div id='spice_display'> <a id='spice_info' class='right'> </a> <div id='spice_microphone'></div> <div id='spice_sentence'></div> <div id='spice_history'></div> <div id='spice_done'></div></div>");    
    $("#spice_info").click(function(){
        showBox();
    });

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