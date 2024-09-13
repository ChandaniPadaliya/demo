const sendResponse = require("../../helpers/sendResponse");
const educationGet = require("./education.get");
const educationpost = require("./education.post")
const educationDelete = require("./education.delete")
const Update = require("./education.put")

exports.geteducationAll = (req, res) => {
    educationGet.getEducation(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((e) => {
            sendResponse(res, e);
        });
};

exports.educationUpdate = (req, res) => {
    Update.EducationUpdate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((e) => {
            sendResponse(res, e);
        });
};

exports.createeducation = (req, res) => {
    educationpost
        .educationCreate(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((err) => {
            sendResponse(res, err);
        });
};

exports.educationDelete = (req, res,) => {
    educationDelete.deleteEducation(req)
        .then((result) => {
            sendResponse(res, result);
        })
        .catch((e) => {
            sendResponse(res, e);
        });
};

// exports.geteducationById = (req, res,) => {
//     educationGet.geteducationyId(req)
//         .then((result) => {
//             sendResponse(res, result);
//         })
//         .catch((e) => {
//             sendResponse(res, e);
//         });
// };
