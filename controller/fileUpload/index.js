const sendResponse = require("../../helpers/sendResponse");
const uploadMedia = require("./file.post");

exports.upload = (req, res) => {
  uploadMedia.upload(req)
    .then((result) => {
      sendResponse(res, result);
    }).catch((err) => {
      sendResponse(res, err);
    });
};
