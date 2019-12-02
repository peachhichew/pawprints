//Import the filestore model/schema
const filedb = require("../models/filestore.js");

//Our upload controller
const upload = (req, res) => {
  console.log("req.files.sampleFile.name:", req.files.sampleFile.name);
  console.log("req.files.sampleFile: ", req.files.sampleFile);
  //If there are no files, return an error
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: "No files were uploaded" });
  }

  //Otherwise, grab the file we are looking for
  //This name (sampleFile) comes from the html form's input
  let sampleFile = req.files.sampleFile;

  //Have the model create an image with this data
  let imageModel = new filedb.FileModel(sampleFile);

  //Save the image to mongo
  let savePromise = imageModel.save();

  //When it is finished saving, let the user know
  savePromise.then(() => {
    res.json({ message: "upload successful" });
  });

  //If there is an error while saving, let the user know
  savePromise.catch(error => {
    res.json({ error });
  });

  //Return out
  return savePromise;
};

//Our retrieval controller
const retrieveImage = (req, res) => {
  //Find the file by name in the database if it exists
  filedb.FileModel.findOne({ name: req.query.name }, (error, doc) => {
    //If there is an error let the user know
    if (error) {
      return res.status(400).json({ error });
    }

    //if there is no doc, return an error
    if (!doc) {
      return res.status(400).json({ error: "File not found" });
    }

    //If there is a doc, setup the mimetype and file size
    res.writeHead(200, {
      "Content-Type": doc.mimetype,
      "Content-Length": doc.size
    });

    //Finally send back the image data
    return res.end(doc.data);
  });
};

const retrieveLatestImage = (request, response) => {
  const req = request;
  const res = response;
  console.log("in retrieve latest image");
  console.log("req.session.account._id", req.session.account._id);

  return filedb.FileModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "An error occurred" });
    }

    return res.json({ pawposts: docs });
  });
};

module.exports.upload = upload;
module.exports.retrieve = retrieveImage;
module.exports.retrieveLatestImage = retrieveLatestImage;
