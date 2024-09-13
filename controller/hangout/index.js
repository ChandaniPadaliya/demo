const sendResponse = require("../../helpers/sendResponse");

const posthangout = require("./hangout.post");
const gethangout = require("./hangout.get");
const updatehangout = require("./hangout.put");
const deletehangout = require("./hangout.delete")
//team create
exports.create = (req, res) => {
    posthangout
        .hangoutCreate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
exports.gethangout = (req, res) => {
    gethangout.getHangout(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};

exports.getHangoutOne = (req, res) => {
    gethangout.getHangoutOne(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};

exports.getHangoutUser = (req, res) => {
    gethangout.getHangoutUser(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
exports.hangoutUpdate = (req, res) => {
    updatehangout.HangoutUpdate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};

exports.joinrequest = (req, res) => {
    posthangout.joinrequest(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
exports.joinEvent = (req, res) => {
    posthangout
        .joinEvent(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
exports.reject = (req, res) => {
    posthangout
        .reject(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};

exports.cancel = (req, res) => {
    posthangout.cancel(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
exports.remove = (req, res) => {
    posthangout.remove(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
exports.deletehangout = (req, res) => {
    deletehangout.deleteHangout(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
exports.getNotification = (req, res) => {
    gethangout.getNotification(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};