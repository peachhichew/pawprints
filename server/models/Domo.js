const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const _ = require("underscore");

let DomoModel = {};

// mongoose.Types.ObjectID is a function that converts
// string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = name => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName
  },
  age: {
    type: Number,
    min: 0,
    required: true
  },
  favoriteFood: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "Account"
  },
  createdData: {
    type: Date,
    default: Date.now
  }
});

DomoSchema.statics.toAPI = doc => ({
  name: doc.name,
  age: doc.age,
  favoriteFood: doc.favoriteFood
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId)
  };

  return DomoModel.find(search)
    .select("name age favoriteFood _id")
    .exec(callback);
};

DomoSchema.statics.findById = (id, callback) => {
  const search = {
    _id: convertId(id)
  };

  return DomoModel.findOne(search, callback);
};

DomoModel = mongoose.model("Domo", DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
