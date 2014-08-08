function ros(name, deps) {
    console.log("This is where plugin code for ros loads in the node process.");


  //var vm = require('vm');

/*
  function include(path) {
        var vm = require('vm');
        var fs = require('fs');
        var code = fs.readFileSync(path, 'utf-8');
        //vm.runInThisContext(code, path);
        eval(code+'');
  }

  include("/opt/openrov/cockpit/src/plugins/ros/roslibjs/src/util/shim/EventEmitter_fromweb.js");
  include("/opt/openrov/cockpit/src/plugins/ros/roslibjs/build/roslib.min.js");
 
*/


  // Start a ROS session 
  var ROSLIB = require("roslib");
  var ros = new ROSLIB.Ros({
        url : 'ws://192.168.254.2:9090'
  });

  ros.on('connection', function() {
     //var fbDiv = document.getElementById('feedback');
     //fbDiv.innerHTML += "<p>Connected to websocket server.</p>";
  });

  ros.on('error', function(error) {
    //var fbDiv = document.getElementById('feedback');
    //fbDiv.innerHTML += "<p>Error connecting to websocket server.</p>";
  });

  ros.on('close', function() {
    //var fbDiv = document.getElementById('feedback');
    //fbDiv.innerHTML += "<p>Connection to websocket server closed.</p>";
  });


  // These lines create a ROS topic and message 
  var cmdVelTopic = new ROSLIB.Topic({
    ros : ros,
    name : '/turtle1/cmd_vel',
    messageType : 'geometry_msgs/Twist'
  });

  var twist = new ROSLIB.Message({
    linear : {
        x : 0.0,
        y : 0.0,
        z : 0.0
    },
    angular : {
        x : 0.0,
        y : 0.0,
        z : 0.0
    }
  });


  // To test if message gets published
  cmdVelTopic.publish(twist);



  // This is how you would register a listner to traffic from the browser
  // Listening to a Depth Hold Toggle from Cockpit and associating
  // a publish ROS message command with it (I think)

  /*
  deps.io.sockets.on('connection', function (socket) {
    socket.on('holdDepth_toggle', function () {
      //sending on to the rov via the serial connection
      cmdVelTopic.publish(twist);
      deps.rov.send('msg(0)');
      console.log('msg(0) sent');
    });
  });
  */

  //This is how you would register a listner to traffic from the ardunio
  //or other parts of the node modules and forward it to the browser
  /*
  deps.globalEventLoop.on('messageIwantToForward', function (data) {
    deps.io.sockets.emit('messageIwantToForward', data);
  });
  */
};

module.exports = ros;
