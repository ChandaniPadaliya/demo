const sendResponse = require("../../helpers/sendResponse");

const postgroup = require("./group.post");
const updategroup = require("./group.put");
const getgroup = require("./group.get")
const deleteGroup = require("./group.delete")
//team create
exports.create = (req, res) => {
    postgroup.groupcreate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};

exports.getgroup = (req, res) => {
    getgroup.getGroup(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};

exports.getGroupOne = (req, res) => {
    getgroup.getGroupOne(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};

exports.groupUpdate = (req, res) => {
    updategroup.groupUpdate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};

exports.joinrequest = (req, res) => {
    postgroup.joinEvent(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};

exports.deleteGroup = (req, res) => {
    deleteGroup.deleteGroup(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
