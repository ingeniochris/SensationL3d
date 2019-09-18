const EtherPortClient = require("etherport-client").EtherPortClient;
const {Board, Led} = require("johnny-five");
const temporal = require("temporal");

//const emitter = new EventEmitter();

const { investColor } = require("../helpers/invest_color");

const board = new Board({
  port: new EtherPortClient({
    host: "192.168.1.72", // casa 130 lamp -181 nodemcu
    port: 3030
  }),
  timeout: 1e5
});

board.on("ready", function() {
  var led = new Led.RGB({
    pins: [13, 12, 15],
    controller: "BLINKM"
  });

  this.repl.inject({
    led: led
  });

  const socket = require("socket.io-client")('http://192.168.1.65:3000');
  socket.on("conectate", data => {
    console.log(data);
  });
  socket.on("parawemos", data => {
    console.log(data);
    led.color(data);
  });
  socket.on("applywemos", data => {
    console.log(data);
    led.color(data);
  });
  socket.on('effectwemos', data =>{
      switch(data){
        case 'intensity':
            console.log('intensity');
            let n=100;
            setInterval(()=>{
                if(n>=0){
                led.intensity(n);
                n-=10;  

                console.log(n+"%");}led.stop();           
            },3000)   
        break;
        case 'rainbow':
          const index1 = 0;
          const rainbow1 = ["FF0000", "FF7F00", "FFFF00", "00FF00", "0000FF", "4B0082", "8F00FF"];
        
          board.loop(1000, () => {
            rgb.color(rainbow1[index1++]);
            if (index1 === rainbow1.length) {
              index1 = 0;
            }
          });
        break;
                
        case 'strobe':
          let index = 0;
          const rainbow = ["FF0000", "FF7F00", "FFFF00", "00FF00", "0000FF", "4B0082", "8F00FF"];
        
          board.loop(1000, () => {
            if (index + 1 === rainbow.length) {
              index = 0;
            }
            rgb.color(rainbow[index++]);
          });
        break;   
        case 'stop':
          board.wait(12000, () => {
            led.stop().off();
          });
        break;                 
      }

  })
});
