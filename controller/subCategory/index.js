const sendResponse = require("../../helpers/sendResponse");
const categoryGet = require("./SubCategory.get");
const categorypost = require("./Subcategory.post")
const categoryDelete = require("./SubCategory.delete")
const Update = require("./SubCategory.put")

exports.getCategoryAll = (req, res) => {
    categoryGet.getcategory(req)
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

exports.createcategory = (req, res,) => {
    categorypost.categoryCreate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((e) => {
            sendResponse(res, e);
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