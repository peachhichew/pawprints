// checks if we attached an account to their session
// then redirect to homepage
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect("/");
  }
  return next();
};

// check if user is already logged in, if so, attach an account to their session
// and then redirect them to the app
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect("/feed");
  }

  return next();
};

const requiresSecure = (req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }

  return next();
};

const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === "production") {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
