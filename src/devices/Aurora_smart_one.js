var EtherPortClient = require("etherport-client").EtherPortClient;
var five = require("johnny-five");
//const emitter = new EventEmitter();

const { investColor } = require("../helpers/invest_color");

var board = new five.Board({
  port: new EtherPortClient({
    host: "192.168.1.69", // casa 130 lamp -181 nodemcu
    port: 3030
  }),
  timeout: 1e5
});

board.on("ready", function() {
  var led = new five.Led.RGB({
    pins: [13, 12, 15]
    // isAnode: true
    //controller: "PCA9685"
  });

  this.repl.inject({
    led: led
  });

  var socket = require("socket.io-client")("http://192.168.1.67:3000"); //pc server
  socket.on("conectate", data => {
    console.log(data);
  });
  socket.on("parawemos", data => {
    // console.log("El server envia COLOR:  "+ data.my)
    //  led5V = investColor(data.my)
    console.log(data);
    led.color(data);
    //  led.blink(data);
  });
  socket.on("applywemos", data => {
    // console.log("El server envia COLOR:  "+ data.my)
    //  led5V = investColor(data.my)
    console.log(data);
    led.color(data);
    //  led.blink(data);
  });
});
