const sendResponse = require("../../helpers/sendResponse");

const DateCreate = require("./date.post");
const dateGet = require("./date.get");
const dateDelete = require("./date.delete");
const dateUpdate = require("./date.put");

//team create
exports.create = (req, res) => {
    DateCreate.DateCreate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
exports.getAll = (req, res) => {
    dateGet.getDate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
// exports.getOne = (req, res) => {
//     dateGet.getOne(req)
//         .then((result) => {
//             sendResponse(res, result);
//         })
//         .catch((err) => {
//             sendResponse(res, err);
//         });
// };

exports.dateUpdate = (req, res) => {
    dateUpdate.dateUpdate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
exports.deleteDate = (req, res) => {
    dateDelete.deleteDate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
