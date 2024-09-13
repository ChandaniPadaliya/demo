const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages");
const { Note } = require("../../models/note.model");
const mongoDbServiceNote = require("../../services/mongoDbService")({ model: Note })

exports.noteDelete = async (req) => {
    try {
        let { id } = req.params
        let getDate = await mongoDbServiceNote.getSingleDocumentById(id)
        if (!getDate) {
            return message.inValidParam(
                responceCode.validationError,
                "please enter valid id"
            );
        }
        await mongoDbServiceNote.deleteDocument(id)
        return message.successResponse(
            responceCode.success, {}
        )
    } catch (err) {
        console.log('err: ', err);
        return message.failureResponse(
            responceCode.internalServerError
        )
    }
}