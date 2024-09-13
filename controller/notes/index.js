const sendResponse = require("../../helpers/sendResponse");

const noteCreate = require("./note.post");
const noteGet = require("./note.get");
const noteDelete = require("./note.delete");
const noteUpdate = require("./note.put");

//team create
exports.create = (req, res) => {
    noteCreate.noteCreate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
exports.getAll = (req, res) => {
    noteGet.noteGet(req)
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

exports.noteUpdate = (req, res) => {
    noteUpdate.noteUpdate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
exports.noteDelete = (req, res) => {
    noteDelete.noteDelete(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
