/*
 * global variabes for spice display and spice intro
 */

var spice_display, spice_intro;

//first thing:
bootstrap();

/*
 * bootstraps the application, adding markup, styles and initializing
 */

function bootstrap() {

    //if spice display is defines, we want to close the application
    if (spice_display) {
        
        hideSpiceDisplay();

    } else {

        //add css for our display
        var spice_stylesheet = document.createElement('link');
        spice_stylesheet.rel = 'stylesheet';
        spice_stylesheet.id = 'spice-stylesheet';
        spice_stylesheet.href = chrome.extension.getURL('../styles/main.css');
        document.head.appendChild(spice_stylesheet);

        //add markup for the spice display
        $("body").append("<div id='spice-display'> <a id='spice-info' class='spice-right'> </a> <div id='spice-microphone'></div> <div id='spice-sentence'></div> <div id='spice-history'></div> <div id='spice-done'></div></div>");
        spice_display = $("#spice-display");
        spice_display.hide();
        spice_display.css({
            right: "-330px"
        });

        //add markup for spice info (tutorial)
        $("body").append("<div id='spice-intro'> <div id='spice-logo'></div> <p>Instructions How to Use Spice Extension</p> Say following commands:<br> <br> <table style='width:100%'><tr><td><div id='spice-quote'> </div></td><td>&quot;Change Background to Green&quot;</td></tr><tr><td><div id='spice-quote'> </div></td><td>&quot;Change Background to Green&quot;</td></tr><tr><td><div id='spice-quote'> </div></td><td>&quot;Change Background to Green&quot;</td></tr></table></div>");
        spice_intro = $("#spice-intro");
        spice_intro.hide();
        spice_intro.css({
            right: "-330px"
        });

        //when the info icon in spice display is clicked, spice info toggles
        spice_display.find("#spice-info").click(function() {
            toggleBoxIntro();
        });

        //start Spice Display
        showSpiceDisplay();
    }
}


/*
 * starts listening for user input
 */

function listen() {

    Spice.init();
}

/*
 * stops listening for the user input
 */

function stopListening() {

    Spice.stopListening();
}

/*
 * shows the plugin
 */

function showSpiceDisplay() {

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

/*
 * hides the plugin
 */

function hideSpiceDisplay() {

    //Close Introduction Page
    hideBoxIntro();
   
    spice_display.animate({
        right: "30px"
    }, 200).animate({
        right: "-330px"
    }, 300, function() {
        spice_display.hide();
        stopListening();
        killApp();
    });

}

/*
 * toggles info box between visible and non visible states
 */

function toggleBoxIntro() {

    if (spice_intro && spice_intro.is(':hidden')) {
        spice_intro.show();
        spice_intro.animate({
            right: "-300px"
        }, 0).animate({
            right: "30px"
        }, 300).animate({
            right: "15px"
        }, 200);
    } else {
        hideBoxIntro();
    }
}

/*
 * hides the info box
 */

function hideBoxIntro() {

    if (spice_intro && spice_intro.is(':visible')) {
        spice_intro.animate({
            right: "30px"
        }, 200).animate({
            right: "-330px"
        }, 300, function() {
            spice_intro.hide();
        });
    }
}

function killApp() {
    //remove stylesheets and markup
    document.getElementById("spice-stylesheet").remove();
    spice_display.remove();
    spice_intro.remove();
    spice_display = undefined;
    spice_intro = undefined;
}