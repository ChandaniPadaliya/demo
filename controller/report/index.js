const sendResponse = require("../../helpers/sendResponse");

const postreport = require("./report.post");
const getreport = require("./report.get");
const deletereport = require("./report.delete");

//team create
exports.create = (req, res) => {
    postreport
        .reportCreate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};

exports.getreport = (req, res) => {
    getreport.ReportGet(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};

exports.getreportOne = (req, res) => {
    getreport.getreportOne(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};
exports.deletereport = (req, res) => {
    deletereport
        .deletereport(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};