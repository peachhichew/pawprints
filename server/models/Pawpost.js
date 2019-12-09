const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let PawpostModel = {};

// mongoose.Types.ObjectID is a function that converts
// string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = content => _.escape(content).trim();

// Outline the schema for each pawpost
const PawpostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  contentImg: {
    type: mongoose.Schema.ObjectId,
  },
  profilePic: {
    type: String,
    // required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Return information related to the pawpost content, content image,
// profile picture, post date creation, and username.
PawpostSchema.statics.toAPI = doc => ({
  content: doc.content,
  contentImg: doc.contentImg,
  profilePic: doc.profilePic,
  createdDate: doc.createdDate,
  username: doc.username,
});

// Return data associated with the account owner
PawpostSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return PawpostModel.find(search)
    .select('content contentImg profilePic createdDate _id username')
    .exec(callback);
};

// Find the account session id
PawpostSchema.statics.findById = (id, callback) => {
  const search = {
    _id: convertId(id),
  };

  return PawpostModel.findOne(search, callback);
};

// Find the usernrame associated with the current account
PawpostSchema.static.findByUsername = (username, callback) => {
  const search = {
    username,
  };

  return PawpostModel.findOne(search, callback);
};

PawpostModel = mongoose.model('Pawpost', PawpostSchema);

module.exports.PawpostModel = PawpostModel;
module.exports.PawpostSchema = PawpostSchema;
