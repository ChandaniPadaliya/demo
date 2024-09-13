const { Device } = require("../../models/device.model");
const httpStatus = require("http-status");

exports.create = async (req, res) => {
  if (!req.body) return res.status(400).json({
    status: httpStatus.BAD_REQUEST,
    message: "Please fill all required field"
  });

  let { deviceId } = req.body;

  const device = await Device.find({ deviceId });

  if (device.length > 0) {
    Device.findOneAndReplace({ deviceId }, req.body, { new: true })
      .then(data => {
        res.status(200).json({
          status: httpStatus.OK,
          data
        });
      })
      .catch(err => {
        res.status(500).json({
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: err.message || "Something went wrong while creating new user."
        });
      });
  }
  else {
    let newDevice = Device(req.body);
    newDevice.save()
      .then(data => {
        res.status(200).json({
          status: httpStatus.OK,
          data
        });
      }).catch(err => {
        res.status(500).json({
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: err.message || "Something went wrong while creating new user."
        });
      });
  }
};
