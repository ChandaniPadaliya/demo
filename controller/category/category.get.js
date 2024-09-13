const { get } = require("mongoose");
const { Category } = require("../../models/category.model");
const { SubCategory } = require("../../models/subCategory.model");
const messages = require("../../utils/messages")
const responescode = require("../../utils/responseCode")
const mongoDbserviceCategory = require("../../services/mongoDbService")({ model: Category })
const mongoDbServiceSubCategory = require("../../services/mongoDbService")({ model: SubCategory })

exports.getcategory = async (req) => {
  try {
    let query = {}

    let data = await mongoDbserviceCategory.getDocumentByQuery(query)

    return messages.successResponse(
      responescode.success, data
    )
  } catch (err) {
    console.log('err: ', err);
    return messages.failureResponse(
      responescode.internalServerError
    )
  }
}


exports.getSubcategory = async (req) => {
  try {
    let { id } = req.params

    let getcategory = await mongoDbserviceCategory.getSingleDocumentById(id)
    if (!getcategory) {
      return messages.invalidRequest(
        responescode.badRequest,
        "invalid id"
      )
    }
    let getSubCatgeory = await mongoDbServiceSubCategory.getDocumentByQuery({ categoryId: id })
    return messages.successResponse(
      responescode.success, getSubCatgeory
    )
  } catch (err) {
    console.log('err: ', err);
    return messages.failureResponse(
      responescode.internalServerError
    )
  }
}


exports.getcategoryyId = async (req) => {
  try {
    let { id } = req.params
    if (!id) {
      return messages.inValidParam(
        responescode.validationError
      );
    }
    let select = ["name", "category"]
    let data = await mongoDbserviceCategory.getDocumentById(
      id,
      select
    )

    return messages.successResponse(
      responescode.success, data
    )
  } catch (err) {
    console.log('err: ', err);
    return messages.failureResponse(
      responescode.internalServerError
    )
  }
}

exports.getCategoryAdmin = async (req) => {
  try {

    let data = await mongoDbserviceCategory.getDocumentByQuery(
      {},
    )
    let getdata = []
    for (const ele of data) {
      let services = await mongoDbServiceSubCategory.getDocumentByQuery({ category: ele._id, isDelete: false });
      let datas = {
        "_id": ele['_id'],
        "name": ele['name'],
        "image": ele['image'],
        "service": services,
      }
      getdata.push(datas)

    };
    for (const ele of getdata) {
      if (ele.service.length <= 0) {
        const idfind = (ee) => ee == ele
        let index = getdata.findIndex(idfind)
        getdata.splice(index, 1)
      }
    }
    return messages.successResponse(
      responescode.success, getdata
    )
  } catch (err) {
    console.log('err: ', err);
    return messages.failureResponse(
      responescode.internalServerError
    )
  }
}

exports.getcategoryyIdAdmin = async (req) => {
  try {
    let { categoryId } = req.body
    if (!id) {
      return messages.inValidParam(
        responescode.validationError
      );
    }
    let select = ["name"]
    let data = await mongoDbserviceCategory.getDocumentByQuery(
      { _id: categoryId },
      select
    )

    return messages.successResponse(
      responescode.success, data
    )
  } catch (err) {
    console.log('err: ', err);
    return messages.failureResponse(
      responescode.internalServerError
    )
  }
}