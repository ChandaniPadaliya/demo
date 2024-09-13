const mongoose = require("mongoose");
const { User } = require("./user.model");

const DeviceSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  deviceId: {
    type: String,
  },
  token: {
    type: String,
    unique: true
  },
  platform: String,
  isNotification: {
    type: Boolean,
    default: true
  },
  isEmail: {
    type: Boolean,
    default: true
  }
});

const Device = mongoose.model("Device", DeviceSchema);

exports.DeviceSchema = DeviceSchema;
exports.Device = Device;