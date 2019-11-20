// import libraries
const path = require("path");
const express = require("express");
const compression = require("compression");
const favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressHandlebars = require("express-handlebars");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const url = require("url");
const csrf = require("csurf");
const multer = require("multer");

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || "mongodb://localhost/Pawprints";

mongoose.connect(dbURL, err => {
  if (err) {
    console.log("Could not connect to database");
    throw err;
  }
});

let redisURL = {
  hostname: "redis-16081.c83.us-east-1-2.ec2.cloud.redislabs.com", // your hostname from RedisLabs
  port: 16081 // your port number from RedisLabs
};

let redisPASS = "gWJxmuIV5cU02zfr61BIvnk3D7R8qk3c"; // password from RedisLabs

if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPASS = redisURL.auth.split(":")[1];
}

// pull in our routes
const router = require("./router.js");

const app = express();

app.use("/assets", express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use("/images", express.static(path.resolve(`${__dirname}/../hosted/img/`)));

app.disable("x-powered-by");
app.use(compression());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(
  session({
    key: "sessionid",
    store: new RedisStore({
      host: redisURL.hostname,
      port: redisURL.port,
      pass: redisPASS
    }),
    secret: "Pawprints",
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true
    }
  })
);

app.use("/", express.static(__dirname + "/public"));

//MULTER CONFIG: to get file photos to temp server storage
const multerConfig = {
  //specify diskStorage (another option is memory)
  storage: multer.diskStorage({
    //specify destination
    destination: function(req, file, next) {
      console.log("in destination");
      next(null, "./public/photo-storage");
    },

    //specify the filename to be unique
    filename: function(req, file, next) {
      console.log("filename: ", file);
      //get the file mimetype ie 'image/jpeg' split and prefer the second value ie'jpeg'
      const ext = file.mimetype.split("/")[1];
      //set the file fieldname to a unique name containing the original name, current datetime and the extension.
      next(null, file.fieldname + "-" + Date.now() + "." + ext);
    }
  }),

  // filter out and prevent non-image files.
  fileFilter: function(req, file, next) {
    if (!file) {
      next();
    }

    // only permit image mimetypes
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

app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/../views`);
app.use(cookieParser());

// csrf must come aFTER app.use(cookieParser());
// and app.use(session({.....})) should come BEFORE the router
app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== "EBADCSRFTOKEN") return next(err);
  console.log("Missing CSRF token");
  return false;
});

router(app);

console.log("==============================");
app.post("/upload", multer(multerConfig).single("photo"), function(req, res) {
  console.log("multerConfig in POST:", multerConfig);
  //Here is where I could add functions to then get the url of the new photo
  //And relocate that to a cloud storage solution with a callback containing its new url
  //then ideally loading that into your database solution.   Use case - user uploading an avatar...
  res.send(
    'Complete! Check out your public/photo-storage folder.  Please note that files not encoded with an image mimetype are rejected. <a href="index.html">try again</a>'
  );
});
console.log("==============================");

app.listen(port, err => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
