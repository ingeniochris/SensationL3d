require ('dotenv').config();
const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require ('connect-mongo')(session);
const flash = require("connect-flash");
const passport = require("passport");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const http = require("http");
const express_enforces_ssl = require('express-enforces-ssl');
const hostValidation = require("host-validation");

// db connection
const mongoose = require("mongoose");
const db = require("./config/database");

// settings
app.set("port", process.env.PORT );
app.set("views", path.join(__dirname, "views"));
app.engine(
  "handlebars",
  exphbs({
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// passport
require("./config/passport")(passport);

// middlewares
app.enable("trust proxy");
app.use(express_enforces_ssl());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  })
);
app.use(morgan("dev"));
// Redirect HTTP to HTTPS,
app.use(
  hostValidation({
    hosts: [
      "127.0.0.1:3000",
      `localhost:${app.get("port")}`,
      "sensationled.herokuapp.com/",
      /.*\.sensationled\.herokuapp\.com$/
    ],
    referers: [/^https:\/\/sensationled\.herokuapp\.com\//],
    mode: 'either',
    fail: (req, res, next) => {
      // send a 418 "I'm a Teapot" Error
      res.status(418).send('I\'m the office teapot. Refer to me only as such.')
  }
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// routes
app.use(require("./routes/index"));
app.use("/colors", require("./routes/colors"));
app.use("/users", require("./routes/users"));

// static folder
app.use(express.static(path.join(__dirname, "public")));

//404
app.use((req,res,next)=>{
  res.status(400).sendFile(path.join(__dirname, 'public','404.html'));
});

// Unhandled errors (500)
app.use(function(err, req, res, next) {
  console.error('An application error has occurred:');
  console.error(err);
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
});


//server
const server = http.createServer(app).listen(app.get("port"), () => {
  console.log(`server on port ${app.get("port")}`);
});

// socket.io y johnny five
const io = require("socket.io")(server);

io.on("connection", function(socket) {
  socket.emit("conectate", { connected: true });
  console.log("Un usuario conectado ID :", socket.id);
  socket.on("changeColor", function(data) {
    console.log("Cliente ID : " + socket.id + " _  COLOR : " + data);
    io.sockets.emit("parawemos", data);
  });

  socket.on("retorno_wemos", function(data) {
    socket.emit("retorno", data);
  });

  socket.on("applycolor", function(data) {
    console.log("clicked", data);
    io.sockets.emit("applywemos", data);
  });
});
