

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
    apply.innerHTML = ' <div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Color aplicado</strong><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
    console.log(color);
  }

  function Effecty(effect){
    socket.emit('effect', effect);
    effect.innerHTML = ' <div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Efecto aplicado</strong><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
    console.log(effect);
  }
  
  
