const controllers = require("./controllers");
const mid = require("./middleware");
// const image = require("./controllers/Image.js");
const file = require("./controllers/files.js");

const router = app => {
  app.get(
    "/login",
    mid.requiresSecure,
    mid.requiresLogout,
    controllers.Account.loginPage
  );
  app.get("/getPawposts", mid.requiresLogin, controllers.Pawpost.getPawposts);
  app.post(
    "/login",
    mid.requiresSecure,
    mid.requiresLogout,
    controllers.Account.login
  );
  app.get("/getToken", mid.requiresSecure, controllers.Account.getToken);
  app.post(
    "/signup",
    mid.requiresSecure,
    mid.requiresLogout,
    controllers.Account.signup
  );
  app.get("/logout", mid.requiresLogin, controllers.Account.logout);
  app.get("/feed", mid.requiresLogin, controllers.Pawpost.feedPage);
  app.post("/feed", mid.requiresLogin, controllers.Pawpost.makePawpost);
  // app.get("/settings", mid.requiresLogin, controllers.Account.settingsPage);
  app.post(
    "/changePassword",
    mid.requiresLogin,
    controllers.Account.changePass
  );
  app.post(
    "/updatePawpost",
    mid.requiresLogin,
    controllers.Pawpost.editPawpost
  );

  // Images get uploaded using /upload
  app.post("/upload", file.upload);

  // Images can be retrieved using /retrieve?name=THE_FILE_NAME_WITH_EXTENSION
  app.get("/retrieve", file.retrieve);
  app.get("/retrieveLatest", file.retrieveLatestImage);

  app.get("/profilePic", controllers.Account.profilePicId);
  app.get(
    "/",
    mid.requiresSecure,
    mid.requiresLogout,
    controllers.Account.loginPage
  );

  app.get("*", (req, res) => {
    // res.sendFile(path.join(__dirname + '/page404.html'));
    // res.send("404: Page not Found", 404);
    res.redirect("/");
  });
};

module.exports = router;
