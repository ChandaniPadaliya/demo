const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const { Hangout } = require("../../models/hangout.model")
const { Notification } = require("../../models/notification.model")
const mongoDbServiceHangout = require("../../services/mongoDbService")({ model: Hangout })
const mongoDbServiceNotification = require("../../services/mongoDbService")({ model: Notification })
const { User } = require("../../models/user.model");
const serviceUser = require("../../services/mongoDbService")({ model: User });

exports.getHangout = async (req) => {
    try {
        let query = {}, data = [], isadded = false
        let populate = [{
            path: "member",
            select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
        }, {
            path: "admin",
            select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
        }]
        let getHangout = await mongoDbServiceHangout.getDocumentByQueryPopulate({ isPublic: true, isCancel: false }, [], populate, { createdAt: -1 })

        for (const ele of getHangout) {

            let getUser = await mongoDbServiceNotification.getSingleDocumentByQuery({ hangout: ele._id, user: req.user._id, type: "req" })

            if (getUser) {
                if (getUser.hangout.toString() == ele._id.toString()) {
                    isadded = true
                } else { isadded = false }
            } else {
                isadded = false
            }
            data.push({ ...ele._doc, isAdded: isadded })
        }

        data = data.sort((a, b) => b.updatedAt - a.updatedAt)
        return message.successResponse(
            responceCode.success, data
        )
    } catch (err) {
        console.log('err: ', err);
        return message.failureResponse(
            responceCode.internalServerError
        )
    }
}

exports.getHangoutOne = async (req) => {
    try {
        let { id } = req.params
        let populate = [{
            path: "member",
            select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
        }, {
            path: "admin",
            select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
        }]
        let getHangout = await mongoDbServiceHangout.getSingleDocumentByQueryPopulate({ _id: id }, [], populate)
        let getUser = await mongoDbServiceNotification.getSingleDocumentByQuery({ hangout: id, user: req.user._id, type: "req" })

        if (getUser) {
            return message.successResponse(
                responceCode.success, { ...getHangout._doc, isRequested: true, }
            )
        }
        return message.successResponse(
            responceCode.success, { ...getHangout._doc, isRequested: false }
        )
    } catch (err) {
        console.log('err: ', err);
        return message.failureResponse(
            responceCode.internalServerError
        )
    }
}

exports.getHangoutUser = async (req) => {
    try {

        let populate = [{
            path: "member",
            select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
        }, {
            path: "admin",
            select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
        }]
        let getHangout = await mongoDbServiceHangout.getDocumentByQueryPopulate({ $or: [{ member: { $in: [req.user._id] } }, { admin: req.user._id }] }, [], populate)
        getHangout = getHangout.sort((a, b) => b.updatedAt - a.updatedAt)
        return message.successResponse(
            responceCode.success, getHangout
        )
    } catch (err) {
        console.log('err: ', err);
        return message.failureResponse(
            responceCode.internalServerError
        )
    }
}

exports.getNotification = async (req) => {
    try {
        let populate = [{
            path: "user",
            select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
        }, {
            path: "admin",
            select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
        }, {
            path: "hangout",
            select: "_id image details addLink  selectDate selectTime  date isPublic eventLink address"
        }]
        let data = await mongoDbServiceNotification.getDocumentByQueryPopulate({ $or: [{ user: req.user._id, type: "cancel" }, { admin: req.user._id }] }, [], populate,)
        data = data.sort((a, b) => b.updatedAt - a.updatedAt)
        return message.successResponse(
            responceCode.success, data
        )
    } catch (err) {
        console.log('err: ', err);
        return message.failureResponse(
            responceCode.internalServerError
        )
    }
}