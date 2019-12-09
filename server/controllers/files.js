// Import the filestore model/schema
const filedb = require("../models/filestore.js");
const models = require("../models");
const Account = models.Account;
const Pawpost = models.Pawpost;

// Our upload controller
const upload = (req, res) => {
  // console.log("req.files.sampleFile.name:", req.files.sampleFile.name);
  // console.log("req.files.sampleFile: ", req.files.sampleFile);
  // console.log("req.files", req.files);
  // If there are no files, return an error

  console.log("req.files", req.files);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: "No files were uploaded" });
  }

  // Otherwise, grab the file we are looking for
  // This name (sampleFile) comes from the html form's input
  const sampleFile = req.files.sampleFile;

  // Have the model create an image with this data
  const imageModel = new filedb.FileModel(sampleFile);

  console.log("imageModel", imageModel);

  // Save the image to mongo
  const savePromise = imageModel.save();

  // When it is finished saving, let the user know
  savePromise.then(() => {
    Account.AccountModel.updateOne(
      { username: req.session.account.username },
      { profilePic: imageModel._id },
      err => {
        if (err) {
          res
            .status(400)
            .json({ error: "Something went wrong, unable to update" });
        }

        res.json({ message: "upload successful" });
      }
    );
  });

  // If there is an error while saving, let the user know
  savePromise.catch(error => {
    res.json({ error });
  });

  // Return out
  return savePromise;
};

const uploadContentImage = (req, res) => {
  console.log("req.files in uploadContentImage", req.files);
  if (!req.files || Object.keys(req.files).length === 0) {
    return res
      .status(400)
      .json({ error: "No files were uploaded for the pawpost" });
  }

  // Otherwise, grab the file we are looking for
  // This name (sampleFile) comes from the html form's input
  const sampleFile = req.files.sampleFile;

  // Have the model create an image with this data
  const imageModel = new filedb.FileModel(sampleFile);

  console.log("imageModel", imageModel);

  // Save the image to mongo
  const savePromise = imageModel.save();

  // When it is finished saving, let the user know
  savePromise.then(() => {
    Pawpost.PawpostModel.findOne(
      { username: req.session.account.username },
      "content createdDate contentImg username",
      (err, data) => {
        if (err) res.send(err);
        console.log("jajajaja", data);
        res.contentType("json");
        // res.send(data);
        console.log("data._id", data._id);
        Pawpost.PawpostModel.updateOne(
          { username: req.session.account.username, _id: data._id },
          { contentImg: imageModel._id },
          err => {
            if (err) {
              res
                .status(400)
                .json({ error: "Something went wrong, unable to update" });
            }

            res.json({ message: "upload successful" });
          }
        );
      }
    ).sort({ createdDate: "desc" });

    // console.log("_id in uploadContentImage", req.body._id);
    // Pawpost.PawpostModel.updateOne(
    //   { username: req.session.account.username, _id: req.body._id },
    //   { contentImg: imageModel._id },
    //   err => {
    //     if (err) {
    //       res
    //         .status(400)
    //         .json({ error: "Something went wrong, unable to update" });
    //     }

    //     res.json({ message: "upload successful" });
    //   }
    // );
  });

  // If there is an error while saving, let the user know
  savePromise.catch(error => {
    res.json({ error });
  });

  // Return out
  return savePromise;
};

// Our retrieval controller
const retrieveImage = (req, res) => {
  // Find the file by name in the database if it exists
  filedb.FileModel.findOne({ _id: req.query._id }, (error, doc) => {
    // If there is an error let the user know
    if (error) {
      return res.status(400).json({ error });
    }

    // if there is no doc, return an error
    if (!doc) {
      return res.status(400).json({ error: "File not found" });
    }

    // If there is a doc, setup the mimetype and file size
    res.writeHead(200, {
      "Content-Type": doc.mimetype,
      "Content-Length": doc.size
    });

    // Finally send back the image data
    return res.end(doc.data);
  });
};

const retrieveLatestImage = (request, response) => {
  const req = request;
  const res = response;
  // console.log("in retrieve latest image");
  // console.log("req.session.account._id", req.session.account._id);

  filedb.FileModel.findOne({}, "img createdAt name", (err, img) => {
    if (err) res.send(err);
    console.log(img);
    res.contentType("json");
    res.send(img);
  }).sort({ createdAt: "desc" });
};

module.exports.upload = upload;
module.exports.retrieve = retrieveImage;
module.exports.retrieveLatestImage = retrieveLatestImage;
module.exports.uploadContentImage = uploadContentImage;
