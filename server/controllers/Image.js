const models = require("../models");
const multer = require("multer");

const Image = models.Image;

const uploadImage = (req, res) => {
  console.log("inside uploadImage");
  const newImage = new Image();
  newImage.img.data = fs.readFileSync(req.file.path);
  newImage.img.contentType = "image/png";
  newImage.save();
};

//MULTER CONFIG: to get file photos to temp server storage
const multerConfig = {
  storage: multer.diskStorage({
    //Setup where the user's file will go
    destination: function(req, file, next) {
      next(null, "./public/photo-storage");
    },

    //Then give the file a unique name
    filename: function(req, file, next) {
      console.log(file);
      const ext = file.mimetype.split("/")[1];
      next(null, file.fieldname + "-" + Date.now() + "." + ext);
    }
  }),

  //A means of ensuring only images are uploaded.
  fileFilter: function(req, file, next) {
    if (!file) {
      next();
    }
    const image = file.mimetype.startsWith("image/");
    if (image) {
      console.log("photo uploaded");
      next(null, true);
    } else {
      console.log("file not supported");

      //TODO:  A better message response to user on failure.
      return next();
    }
  }
};

module.exports.uploadImage = uploadImage;
module.exports.multerConfig = multerConfig;
