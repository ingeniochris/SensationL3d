var socket = io();

const cw = Raphael.colorwheel($(".colorwheel_large")[0], 280, 180);

cw.input($(".inputcolor", "body")[0]);
cw.onchange(function (data) {
  socket.emit("changeColor", data.hex);
  //console.log(data.hex);
});

socket.on("onOn", ({ name, powerOn }) => {
  if (powerOn) {
    idOnOff.innerHTML = `
      <li class="nav-item active">
      <span class="nav-link">
      <img src="https://img.icons8.com/color/30/000000/online.png" alt="icon"/>
        Lampara Online</span>
    </li>
      `;
  } else {
    idOnOff.innerHTML = `
      <li class="nav-item active">
      <span class="nav-link">
      <img src="https://img.icons8.com/color/48/000000/offline.png" alt="off"/>
        Lampara Offline</span>
    </li>
      `;
  }
});

function Color(color) {
  socket.emit("applycolor", color);
  apply.innerHTML =
    ' <div class="alert alert-success alert-dismissible fade show" role="alert"><strong>Color aplicado</strong><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
  // console.log(color);
}
