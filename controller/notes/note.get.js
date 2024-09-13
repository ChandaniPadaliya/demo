const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages");
const { Note } = require("../../models/note.model");
const mongoDbServiceNote = require("../../services/mongoDbService")({ model: Note })

exports.noteGet = async (req) => {
    try {
        let { id } = req.params
        let { pageNumber, pageSize, } = req.body
        let populate = [{ path: "opuserId", select: "_id fullName address profile  lifestyle birthDate  about profession gender email age" },
        { path: "userId", select: "_id fullName address profile  lifestyle birthDate  about profession gender email age" }]
        let get = await mongoDbServiceNote.getDocumentByQueryPopulate({ $or: [{ userId: req.user._id, opuserId: id }, { userId: id, opuserId: req.user._id }] }, [], populate, pageNumber, pageSize, { updatedAt: -1 })
        return message.successResponse(
            responceCode.success, get
        )
    } catch (err) {
        console.log('err: ', err);
        return message.failureResponse(
            responceCode.internalServerError
        )
    }
}

