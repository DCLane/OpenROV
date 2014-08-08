function ros(name, deps) {
  console.log("ROS plugin started");

  // Start a ROS session 
  var ROSLIB = require("roslib")
  var ros = new ROSLIB.Ros({
        url : 'ws://192.168.254.2:9090'
  });

  ros.on('connection', function() {
     console.log('ROS connected to websocket');
  });

  ros.on('error', function(error) {
     console.log('ROS error connecting to websocket');
  });

  ros.on('close', function() {
     console.log('ROS closed websocket connection');
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

  var rosDebug = new ROSLIB.Topic({
     ros : ros,
     name : '/openrov/debug',
     messageType : 'std_msgs/String'
  });

  var debug = new ROSLIB.Message({
     data : ''
  });


  // RAW STATUS TOPIC
  var rosStatus = new ROSLIB.Topic({
     ros : ros,
     name : '/openrov/status',
     messageType : 'openrov/rovstatus'
  });

  var status = new ROSLIB.Message({
     status : ''
  });


  // MOTOR TARGET TOPIC 
  var rosMotorTarget = new ROSLIB.Topic({
     ros : ros,
     name : '/openrov/motortarget',
     messageType : 'openrov/motortarget'
  });
/*
  var motortarget = new ROSLIB.Message({
     motors : [0,0,0]
  });
*/

  // NAVDATA TOPIC
  var rosNavData = new ROSLIB.Topic({
     ros : ros,
     name : '/openrov/navdata',
     messageType : 'openrov/navdata'
  });

  var navdata = new ROSLIB.Message({
     roll : 0.0,
     pitch : 0.0,
     yaw : 0.0,
     thrust : 0.0,
     heading : 0.0,
     depth : 0.0,
  });



  var listener = new ROSLIB.Topic({
     ros : ros,
     name : '/turtle1/cmd_vel',
     messageType : 'geometry_msgs/Twist'
  });

  listener.subscribe(function(message) {
     console.log('ROS: I heard a ros msg.');     
     //rosNavData.publish(navdata);
  });

  console.log('ROS finished loading ros things.');

  // This is how you would register a listner to traffic from 
  // the browser. Currently listening to a Depth Hold Toggle 
  // from Cockpit and publishing a ROS message

  deps.io.sockets.on('connection', function (socket) {
    socket.on('holdDepth_toggle', function () {

      debug.data = 'Hold depth toggled'
      rosDebug.publish(debug);

      //socket.emit('plugin.rovpilot.headingHold.toggle');

      deps.rov.send('yaw(50)');
      //deps.rov.emit('plugin.rovpilot.setYaw', .5);

      deps.rov.send('msg(0)');
      console.log('msg(0) sent');

    });
  });
  

  //This is how you would register a listner to traffic from the ardunio
  //or other parts of the node modules and forward it to the browser

  //deps.globalEventLoop.on('serial-recieved', function (data) {
  deps.rov.on('status', function (data) {
    status.status = JSON.stringify(data);
    rosStatus.publish(status);
    //deps.io.sockets.emit('messageIwantToForward', data);

    if ('mtarg' in data) {
        var mtargs = data.mtarg.split(",");
        //motortarget[0] = parseInt(mtargs[0]);
        //motortarget[1] = parseInt(mtargs[1]);
        //motortarget[2] = parseInt(mtargs[2]);
        //rosMotorTarget.publish(motortarget);
    }
  });


  deps.rov.on('navdata', function (data) {
    if ('roll' in data) navdata.roll = parseFloat(data.roll);
    if ('pitch' in data) navdata.pitch = parseFloat(data.pitch);
    if ('yaw' in data) navdata.yaw = parseFloat(data.yaw);
    if ('thrust' in data) navdata.thrust = parseFloat(data.thrust);
    if ('hdgd' in data) navdata.heading = parseFloat(data.hdgd);
    if ('deapth' in data) navdata.depth = parseFloat(data.deapth);
    rosNavData.publish(navdata);
  });



};

module.exports = ros;
