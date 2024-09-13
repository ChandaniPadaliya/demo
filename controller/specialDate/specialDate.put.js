const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const { specialDate } = require("../../models/specialDate.model")
const mongoDbServiceSpecialDate = require("../../services/mongoDbService")({ model: specialDate })

exports.specialdateUpdate = async (req) => {
    try {
        let { id } = req.params

        let { dateTitle, date, selectDate, selectTime, longitude, latitude, address, description } = req.body
        let getDate = await mongoDbServiceSpecialDate.getSingleDocumentById(id)
        if (!getDate) {
            return message.inValidParam(
                responceCode.validationError,
                "please enter valid id"
            );
        }

        getDate = getDate.toJSON()
        getDate.dateTitle = dateTitle ? dateTitle : getDate.dateTitle
        getDate.date = date ? date : getDate.date
        getDate.selectDate = selectDate ? selectDate : getDate.selectDate
        getDate.selectTime = selectTime ? selectTime : getDate.selectTime
        getDate.address = address ? address : getDate.address
        getDate.description = description ? description : getDate.description
        getDate.location.coordinates[0] = longitude ? longitude : getDate.location.coordinates[0]
        getDate.location.coordinates[1] = latitude ? latitude : getDate.location.coordinates[1]

        await mongoDbServiceSpecialDate.findOneAndUpdateDocument({ _id: id }, getDate, { new: true })

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