const responceCode = require("../../utils/responseCode")
const message = require("../../utils/messages")
const { Hangout } = require("../../models/hangout.model")
const mongoDbServiceHangout = require("../../services/mongoDbService")({ model: Hangout })

exports.HangoutUpdate = async (req) => {
    try {
        let { id } = req.params
        let { image, details, addLink, selectDate, selectTime, date, lat, long, address, isPublic } = req.body
        let getHangout = await mongoDbServiceHangout.getDocumentById(id)

        if (!getHangout) {
            return message.inValidParam(
                responceCode.validationError,
                "please enter valid id"
            );
        }

        getHangout = getHangout.toJSON()
        getHangout.isPublic = isPublic == true ? true : false
        getHangout.image = image == undefined ? getHangout.image : image
        getHangout.details = details ? details : getHangout.details
        getHangout.addLink = addLink ? addLink : getHangout.addLink
        getHangout.selectTime = selectTime ? selectTime : getHangout.selectTime
        getHangout.selectDate = selectDate ? selectDate : getHangout.selectDate
        getHangout.date = date ? date : getHangout.date
        getHangout.selectLocation.coordinates[0] = long ? long : getHangout.selectLocation.coordinates[0]
        getHangout.selectLocation.coordinates[1] = lat ? lat : getHangout.selectLocation.coordinates[1]
        getHangout.address = address ? address : getHangout.address
        await mongoDbServiceHangout.findOneAndUpdateDocument({ _id: id }, getHangout, { new: true })
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