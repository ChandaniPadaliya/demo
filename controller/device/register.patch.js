const { Device } = require("../../models/device.model");
const httpStatus = require("http-status");

exports.update = async (req, res) => {
  if (!req.body) return res.status(400).json({
    status: httpStatus.BAD_REQUEST,
    message: "Please fill all required field"
  });

  const id = req.params.id;
  console.log("🚀 ~ file: register.put.js ~ line 11 ~ exports.update=async ~ id", id);

  await Device.findOneAndUpdate({ deviceId: id }, {
    $set: {
      isNotification: req.body.isNotification,
      // isEmail: req.body.isEmail,
    }
  }, { new: true })
    .then(data => {
      console.log("🚀 ~ file: register.js ~ line 12 ~ data", data);
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
};


