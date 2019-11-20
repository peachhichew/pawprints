const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

let ImageModel = {};
const ImageSchema = new mongoose.Schema({
  img: { data: Buffer, contentType: String }
});

ImageModel = mongoose.model("Image", ImageSchema);

module.exports.ImageModel = ImageModel;
module.exports.ImageSchema = ImageSchema;
