const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const { Group } = require("../../models/group.model")
const mongoDbServiceGroup = require("../../services/mongoDbService")({ model: Group })

exports.getGroup = async (req) => {
    try {
        let query = {}
        let populate = [{
            path: "admin",
            select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
        }]

        let getGroup = await mongoDbServiceGroup.getDocumentByQueryPopulate({ isPublic: true }, [], populate)
        return message.successResponse(
            responceCode.success, getGroup
        )
    } catch (err) {
        console.log('err: ', err);
        return message.failureResponse(
            responceCode.internalServerError
        )
    }
}



exports.getGroupOne = async (req) => {
    try {
        let { id } = req.params
        let populate = [{
            path: "admin",
            select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
        }, {
            path: "member",
            select: "_id fullName address profile  lifestyle birthDate  about profession gender email age"
        }]

        let getGroup = await mongoDbServiceGroup.getSingleDocumentByQueryPopulate({ _id: id }, [], populate)
        let getGroup1 = await mongoDbServiceGroup.getSingleDocumentByQuery({ _id: id })
        let member = getGroup1.member

        let isadd = false; let isAdmin = false

        if (member.includes(req.user._id.toString())) {
            isadd = true
        } else {
            isadd = false
        }


        if (getGroup.admin._id.toString() === req.user._id.toString()) {
            isAdmin = true
        } else {
            isAdmin = false
        }
        return message.successResponse(
            responceCode.success, {
            ...getGroup._doc, isJoined: isadd, isAdmin: isAdmin
        }
        )
    } catch (err) {
        console.log('err: ', err);
        return message.failureResponse(
            responceCode.internalServerError
        )
    }
}