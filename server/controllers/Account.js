const models = require("../models");

const Account = models.Account;

// Function to render the login page
const loginPage = (req, res) => {
  res.render("login", { csrfToken: req.csrfToken() });
};

// When the user is logging out, destroy the current session
// and redirect the user to the index page
const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

// When the user logs in, validate the credentials by using
// the Account Model's authenticate() function to ensure that
// the username and password match the account in the db.
const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  return Account.AccountModel.authenticate(
    username,
    password,
    (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: "Wrong username or password" });
      }

      req.session.account = Account.AccountModel.toAPI(account);

      return res.json({ redirect: "/profile" });
    }
  );
};

// Upon successful account creation, generate a hash to encrypt the
// password. Ensure that this username doesn't already exist in the db
// and that the passwords match.
const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // return an error if there are any empty fields
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // return an error if the passwords don't match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: "/profile" });
    });

    savePromise.catch(err => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: "Username already in use." });
      }

      return res.status(400).json({ error: "An error occurred" });
    });
  });
};

// If the user is able to use the password provided in the field, then
// we know it is the correct password and the authentication will be
// successful. Next, we generate a hash for the new password entered
// and we update the password according to the username of the existing
// account. We will need to use the salt from the current/old password
// to generate the hash for the new password.
const changePass = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.currentPassword = `${req.body.currentPassword}`;
  req.body.newPassword1 = `${req.body.newPassword1}`;
  req.body.newPassword2 = `${req.body.newPassword2}`;

  // check if there are any empty fields
  if (
    !req.body.currentPassword ||
    !req.body.newPassword1 ||
    !req.body.newPassword2
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // make sure the new passwords are the same
  if (req.body.newPassword1 !== req.body.newPassword2) {
    return res.status(400).json({ error: "New passwords do not match" });
  }

  // if the new passwords are the same as the existing password, send
  // back an error
  if (
    req.body.currentPassword === req.body.newPassword1 &&
    req.body.currentPassword === req.body.newPassword2
  ) {
    return res
      .status(400)
      .json({ error: "Current and new passwords are the same" });
  }

  return Account.AccountModel.authenticate(
    req.session.account.username,
    req.body.currentPassword,
    (err, doc) => {
      console.log("doc", doc);
      return Account.AccountModel.generateHash(
        req.body.newPassword1,
        (salt, hash) => {
          return Account.AccountModel.updateOne(
            { username: req.session.account.username },
            { salt, password: hash },
            error => {
              if (error) {
                return res.status(400).json({ error });
              }
              return res.json({ message: "password successfully changed" });
            }
          );
        }
      );
    }
  );
};

const profilePicId = (request, response) => {
  const req = request;
  const res = response;

  return Account.AccountModel.findOne(
    { username: req.session.account.username },
    "username profilePic",
    (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: "An error occurred" });
      }

      // console.log("docs for profilePic:", docs);

      return res.json({ account: docs });
    }
  );
};

// Generates a new csrf token
const getToken = (request, response) => {
  const req = request;
  const res = response;
  const csrfJSON = {
    csrfToken: req.csrfToken()
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.changePass = changePass;
module.exports.profilePicId = profilePicId;
