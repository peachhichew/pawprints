// Grab mongoose and setup our empty model
const mongoose = require('mongoose');
let FileModel = {};

// mongoose.Types.ObjectID is a function that converts
// string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;

// Create a file schema. This matches the format of express-fileupload's
// image upload, so we can just drop the file directly into the model
const FileSchema = new mongoose.Schema({
  name: {
    // The file name
    type: String,
  },
  data: {
    // The actual image data
    type: Buffer,
  },
  size: {
    // The size of the image in bytes
    type: Number,
  },
  encoding: {
    // The type of encoding used in the image
    type: String,
  },
  tempFilePath: {
    // The temporary file path
    type: String,
  },
  truncated: {
    // If the image was cutoff at all
    type: Boolean,
  },
  mimetype: {
    // The type of image it is
    type: String,
  },
  md5: {
    // The hash for the image
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Return information related to the pawpost content, content image,
// profile picture, post date creation, and username.
FileSchema.statics.toAPI = doc => ({
  name: doc.name,
});

// Return data associated with the account owner
FileSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return FileModel.find(search)
    .select('name _id username')
    .exec(callback);
};

// Find the image id
FileSchema.statics.findById = (id, callback) => {
  const search = {
    _id: convertId(id),
  };

  return FileModel.findOne(search, callback);
};

// Create our file model based on the schema above
FileModel = mongoose.model('FileModel', FileSchema);

module.exports.FileModel = FileModel;
module.exports.FileSchema = FileSchema;
