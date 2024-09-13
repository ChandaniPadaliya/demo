const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages");
const { Note } = require("../../models/note.model");
const mongoDbServiceNote = require("../../services/mongoDbService")({ model: Note })


exports.noteUpdate = async (req) => {
    try {
        let { id } = req.params
        let { title, description } = req.body
        let getNote = await mongoDbServiceNote.getSingleDocumentById(id)
        if (!getNote) {
            return message.inValidParam(
                responceCode.validationError,
                "please enter valid id"
            );
        }
        getNote = getNote.toJSON()
        getNote.title = title ? title : getNote.title
        getNote.description = description ? description : getNote.description

        await mongoDbServiceNote.findOneAndUpdateDocument({ _id: id }, getNote, { new: true })
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