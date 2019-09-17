const mongoose = require("mongoose");

const URI = process.env.MONGODB_CLUSTER
  ? process.env.MONGODB_CLUSTER
  : "mongodb://localhost/SensationL3d";

mongoose.connect(URI, { useNewUrlParser: true, useCreateIndex: true,  useUnifiedTopology: true });

const db = mongoose.connection;
module.exports=db;
