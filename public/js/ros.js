(function (window, $, undefined) {
    'use strict';

    var ros;

    ros = function ros(cockpit) {
        console.log("Loading ros plugin in the browser.");

        // Instance variables
        this.cockpit = cockpit;

    //example keyboard hook
    /*
    this.cockpit.emit('inputController.register',
      {
        name: "ros.keyBoardMapping",
        description: "Example for keymapping.",
        defaults: { keyboard: 'alt+0', gamepad: 'X' },
        down: function() { console.log('0 down'); },
        up: function() { console.log('0 up'); },
        secondary: [
          {
            name: "ros.keyBoardMappingDepdent",
            dependency: "ros.keyBoardMapping",
            defaults: { keyboard: '9', gamepad: 'RB' },
            down: function() { console.log('####'); }
          }
        ]
      });
    */

    // for plugin management:
    this.name = 'ros';   // for the settings
    this.viewName = 'ros plugin'; // for the UI
    this.canBeDisabled = true; //allow enable/disable
    this.enable = function () {
      alert('ros enabled');
    };
    this.disable = function () {
      alert('ros disabled');
    };
  };

  //This will be called by the input manager automatically
  ros.prototype.listen = function listen() {
    var rov = this;

    //This snippet allows you to listen to events coming
    //from the beaglebone.  Those coulbe be navdata, status, etc...
    /*
    this.cockpit.socket.on('navdata', function (data) {
      rov.dosomethingwith(data);
    });
    /*

    //This example will put an entry in the pop-up Heads Up Menu
    /*
    var item = {
      label: ko.observable("ros menu"),
      callback: function () {
        alert('ros menu item');
        item.label(this.label() + " Foo Bar");
      }
    };
    rov.cockpit.emit('headsUpMenu.register', item);
    */

    //the code below is used to load other asssets that have a path relative to the current
    //path of the executing javascript file.
    var jsFileLocation = urlOfJsFile('ros.js');

    /*
    $.get(jsFileLocation + '../somefile.txt',function(data){
      console.log(data);
    });
    */

    // If you have more than a couple lines of HTML it might be better
    // to place them in a seperate .html file. The code below will load
    // them in to an element.
    /*
    $('#divtoloadcontent').load(jsFileLocation + '../template.html',function(data){
      console.log('template loaded');
    });
    */

    //For loading third party libraries that are bower dependencies
    /*
    $.getScript('plugin_components/<projectname>/<filetoload>.js',function(){
      console.log("loaded");
    });
    */

  };

    window.Cockpit.plugins.push(ros);

}(window, jQuery));
