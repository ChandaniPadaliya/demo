const sendResponse = require("../../helpers/sendResponse");

const specialDateCreate = require("./specialDate.post");
const specialdateGet = require("./specialDate.get");
const specialdateDelete = require("./specialDate.delete");
const specialdateUpdate = require("./specialDate.put");

//team create
exports.create = (req, res) => {
    specialDateCreate.specialDateCrate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
exports.getAll = (req, res) => {
    specialdateGet.getSpecialDate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
exports.Delete = (req, res) => {
    specialdateDelete.SpecialDateDelete(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};

exports.dateUpdate = (req, res) => {
    specialdateUpdate.specialdateUpdate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
