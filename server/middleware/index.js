// Checks if we attached an account to their session
// then redirect to homepage
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

// Check if user is already logged in. if so, attach an account to their session
// and then redirect them to the app
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/profile');
  }

  return next();
};

// Ensure that we are using HTTPs, not just HTTP.
const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }

  return next();
};

// Otherwise, bypass it
const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
