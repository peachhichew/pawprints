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
  // app.get("/maker", mid.requiresLogin, controllers.Domo.makerPage);
  app.get("/feed", mid.requiresLogin, controllers.Pawpost.feedPage);
  // app.post("/maker", mid.requiresLogin, controllers.Domo.make);
  app.post("/feed", mid.requiresLogin, controllers.Pawpost.makePawpost);
  app.post("/updateDomo", mid.requiresLogin, controllers.Domo.edit);
  app.get(
    "/",
    mid.requiresSecure,
    mid.requiresLogout,
    controllers.Account.loginPage
  );
};

module.exports = router;
