const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const _ = require("underscore");

let PawpostModel = {};

// mongoose.Types.ObjectID is a function that converts
// string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
// const setName = content => _.escape(content).trim();

const PawpostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
    // set: setName
  },
  contentImg: {
    type: String,
    trim: true
  },
  profilePic: {
    type: String,
    // required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Account"
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

PawpostSchema.statics.toAPI = doc => ({
  content: doc.content,
  contentImg: doc.contentImg,
  profilePic: doc.profilePic,
  createdDate: doc.createdDate
});

PawpostSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId)
  };

  return PawpostModel.find(search)
    .select("content contentImg profilePic createdDate _id")
    .exec(callback);
};

PawpostSchema.statics.findById = (id, callback) => {
  const search = {
    _id: convertId(id)
  };

  return PawpostModel.findOne(search, callback);
};

PawpostModel = mongoose.model("Pawpost", PawpostSchema);

module.exports.PawpostModel = PawpostModel;
module.exports.PawpostSchema = PawpostSchema;
