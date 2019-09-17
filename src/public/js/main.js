
  var socket = io();

  const cw = Raphael.colorwheel($(".colorwheel_large")[0], 280, 180);

  cw.input($(".inputcolor", "body")[0]);
  cw.onchange(function(data) {
    socket.emit("changeColor", data.hex);
    console.log(data.hex);
  });
  socket.on("retorno", function(data) {
    console.log(data);
  });

  function Color(color) {
    socket.emit("applycolor", color);
    console.log(color);
  }
  
  
