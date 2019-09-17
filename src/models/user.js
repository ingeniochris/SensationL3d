const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

UserSchema.method.encryptPassword = async password => {
  const salt = bcrypt.genSalt(10);
  const hash = bcrypt.hash(password, salt);
  return hash;
};

UserSchema.method.matchPassword = async password => {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("users", UserSchema);
