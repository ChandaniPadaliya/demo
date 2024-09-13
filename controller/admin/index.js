const { sendResponse } = require("../../helpers/sendResponse");
const adminpost = require("./admin.post")


exports.admincreate = (req, res) => {
    adminpost.registerAdmin(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((e) => {
            sendResponse(res, e);
        });
};