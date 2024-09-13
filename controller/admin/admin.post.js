const messages = require("../../../utils/messages")
const responescode = require("../../../utils/responescode")
const bcrypt = require("bcrypt");
const { Admin } = require("../../models/admin.model");
const mongoDbserviceAdmin = require("../../service/mongoDbservice")({ model: Admin })


exports.registerAdmin = async (req) => {
    try {
        let { name, email, password } = req.body;

        let existUser = await mongoDbserviceAdmin.getSingleDocumentByQuery({ email });
        if (existUser) {
            return messages.isAssociated(
                responescode.found
            );
        }
        let salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        let data = {
            name,
            email,
            password
        };
        let newUser = await mongoDbserviceAdmin.createDocument(data);
        const token = newUser.generateAdminToken();
        newUser = newUser.toJSON();
        delete newUser.password;
        delete newUser.__v;
        return messages.successResponse(
            responescode.success,
            { ...newUser, token }
        );
    } catch (error) {
        console.log("error: ", error);
        return messages.failureResponse(
            responescode.internalServerError
        );
    }
};