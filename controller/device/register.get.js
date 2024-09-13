const { Device } = require("../../models/device.model");
const httpStatus = require("http-status");

exports.findAll = (req, res) => {

    Device.find()
        .then(data => {
            console.log("🚀 ~ file: register.js ~ line 12 ~ data", data);
            res.status(200).json({
                status: httpStatus.OK,
                total: data.length,
                data
            });
        }).catch(err => {
            res.status(500).json({
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: err.message || "Something went wrong while creating new user."
            });
        });
};

exports.findOne = (req, res) => {

    const id = req.params.id;

    Device.findOne({ deviceId: id })
        .then(data => {
            console.log("🚀 ~ file: register.js ~ line 12 ~ data", data);
            res.status(200).json({
                status: httpStatus.OK,
                total: data.length,
                data
            });
        }).catch(err => {
            res.status(500).json({
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: err.message || "Something went wrong while creating new user."
            });
        });
};

