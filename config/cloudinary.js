const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: "videostatustechnomaergin",
    api_key: "735692458221215",
    api_secret: "th72lPYd9T5Xn3r59SuqX36k-Ag"
});


module.exports = cloudinary;