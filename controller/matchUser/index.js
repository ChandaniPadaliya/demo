const sendResponse = require("../../helpers/sendResponse");

const postMatch = require("./matchUser.post");
const getMatch = require("./matchUser.get");
const deleteMatch = require("./matchUser.delete");

//team create
exports.create = (req, res) => {
    postMatch
        .MatchUserCreate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};

exports.getmatch = (req, res) => {
    getMatch.getmatch(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};

exports.getmatchOne = (req, res) => {
    getMatch.getmatchOne(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
exports.deleteMatch = (req, res) => {
    deleteMatch
        .deletematch(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};