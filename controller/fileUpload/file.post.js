const message = require("../../utils/messages");
const responseCode = require("../../utils/responseCode");
const { uploader } = require("../../utils/cloudinaryImage.upload");

exports.upload = async (req) => {

  try {

    let files = await req.files;
    let type = await req.type
    let result = files && await Promise.all(files.map(imageData => uploader(imageData)));
    result = result.toString();

    let responseData = {
      url: result.split(","),
    };

    return message.requestValidatedWithData(
      responseCode.success,
      "image upload successfull",
      responseData
    );
  } catch (error) {
    console.log("error: ", error);
    return message.failureResponse(
      responseCode.internalServerError
    );
  }
};