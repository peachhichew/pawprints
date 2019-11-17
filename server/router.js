const controllers = require("./controllers");
const mid = require("./middleware");

const router = app => {
  app.get(
    "/login",
    mid.requiresSecure,
    mid.requiresLogout,
    controllers.Account.loginPage
  );
  app.get("/getDomos", mid.requiresLogin, controllers.Domo.getDomos);
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
  app.post("/updateDomo", mid.requiresLogin, controllers.Domo.edit);
  app.post(
    "/updatePawpost",
    mid.requiresLogin,
    controllers.Pawpost.editPawpost
  );
  app.get(
    "/",
    mid.requiresSecure,
    mid.requiresLogout,
    controllers.Account.loginPage
  );

  app.get("*", function(req, res) {
    // res.sendFile(path.join(__dirname + '/page404.html'));
    // res.send("404: Page not Found", 404);
    res.redirect("/");
  });
};

module.exports = router;
