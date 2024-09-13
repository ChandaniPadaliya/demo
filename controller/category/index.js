const sendResponse = require("../../helpers/sendResponse");
const categoryGet = require("./category.get");
const categorypost = require("./category.post")
const categoryDelete = require("./category.delete")
const Update = require("./category.put")

exports.getCategoryAll = (req, res) => {
    categoryGet.getCategoryAdmin(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((e) => {
            sendResponse(res, e);
        });
};

exports.categoryUpdate = (req, res) => {
    Update.categoryUpdate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((e) => {
            sendResponse(res, e);
        });
};

exports.getcategoryById = (req, res,) => {
    categoryGet.getcategoryyId(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((e) => {
            sendResponse(res, e);
        });
};
exports.getcategoryyIdAdmin = (req, res,) => {
    categoryGet.getcategoryyIdAdmin(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((e) => {
            sendResponse(res, e);
        });
};


exports.createcategory = (req, res) => {
    categorypost
        .categoryCreate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};



exports.categoryDelete = (req, res,) => {
    categoryDelete.deleteCategory(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((e) => {
            sendResponse(res, e);
        });
};