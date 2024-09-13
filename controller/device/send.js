const { Device } = require("../../models/device.model");
const { sendAndroid } = require("../../utils/notification");
const httpStatus = require("http-status");


exports.findAll = (req, res) => {

  const body = req.body;
  if (!req.body) return res.status(200).json({
    status: httpStatus.OK,
    message: "Data can not be empty"
  });

  Device.find((err, devices) => {
    if (!err && devices) {
      let androidDevices = [];
      devices.forEach(device => {
        if (device.platform === "ios") {
          // sendIos(device.token);
        } else if (device.platform === "android") {
          androidDevices.push(device.token);
        }
      });
      if (androidDevices) {
        sendAndroid(androidDevices, body);
        res.status(200).json({
          status: httpStatus.OK,
          message: "Notification has been sent"
        });
      } else {
        res.status(404).json({
          status: httpStatus.NOT_FOUND,
          message: "Devices are not available"
        });
      }
    } else {
      res.status(500).json({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: err.message || "Something went wrong while sending notification."
      });
    }
  });
};


