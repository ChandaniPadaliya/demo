const sendResponse = require("../../helpers/sendResponse");

const goalCreate = require("./goals.post");
const goalGet = require("./goals.get");
const goalDelete = require("./goals.delete");
const goalUpdate = require("./goals.put");

//team create
exports.create = (req, res) => {
    goalCreate.goalCreate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
exports.getAll = (req, res) => {
    goalGet.getGoal(req)
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

exports.goalUpdate = (req, res) => {
    goalUpdate.goalUpdate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
exports.deletegoal = (req, res) => {
    goalDelete.deleteGoal(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
