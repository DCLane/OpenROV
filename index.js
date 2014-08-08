function ros(name, deps) {
  console.log("ROS plugin started");

  // Start a ROS session 
  var ROSLIB = require("roslib")
  var ros = new ROSLIB.Ros({
        url : 'ws://192.168.254.2:9090'
  });

  ros.on('connection', function() {
  });

  ros.on('error', function(error) {
  });

  ros.on('close', function() {
  });

  // Create ROS topic and msg
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

  var rosDebug= new ROSLIB.Topic({
     ros : ros,
     name : '/openrov/debug',
     messageType : 'std_msgs/String'
  });

  var debug = new ROSLIB.Message({
     data : ''
  });

  var rosStatus = new ROSLIB.Topic({
     ros : ros,
     name : '/openrov/status',
     messageType : 'openrov/rovstatus'
  });

  var status = new ROSLIB.Message({
     data : ''
  });

  var rosNavData = new ROSLIB.Topic({
     ros : ros,
     name : '/openrov/navdata',
     messageType : 'openrov/rovstatus'
  });

  var navdata = new ROSLIB.Message({
     data : ''
  });

  // This is how you would register a listner to traffic from the browser
  // Listening to a Depth Hold Toggle from Cockpit and publishing a ROS message

  deps.io.sockets.on('connection', function (socket) {
    socket.on('holdDepth_toggle', function () {
      debug.data = 'Hold depth toggled'
      rosDebug.publish(debug);

      //deps.rov.send('msg(0)');
      //console.log('msg(0) sent');
    });
  });
  

  //This is how you would register a listner to traffic from the ardunio
  //or other parts of the node modules and forward it to the browser
  
  deps.rov.on('status', function (data) {
    status.data = JSON.stringify(data);
    rosStatus.publish(status);

    //console.log(data);
    //deps.io.sockets.emit('messageIwantToForward', data);
  });

  deps.rov.on('navdata', function (data) {
    navdata.data = JSON.stringify(data);
    rosNavData.publish(navdata);
  });

};

module.exports = ros;
