const models = require("../models");

const Account = models.Account;

const loginPage = (req, res) => {
  res.render("login", { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;
  console.log("username: ", username);
  console.log("pwd: ", password);

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

      return res.json({ redirect: "/feed" });
    }
  );
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;
  console.log("username: ", req.body.username);
  console.log("password: ", req.body.pass);

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  console.log("req.body.pass:", req.body.pass);

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
      return res.json({ redirect: "/feed" });
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

const changePass = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.currentPassword = `${req.body.currentPassword}`;
  req.body.newPassword1 = `${req.body.newPassword1}`;
  req.body.newPassword2 = `${req.body.newPassword2}`;
  console.log("currentPassword:", req.body.currentPassword);
  console.log("password 1:", req.body.newPassword1);
  // console.log("password 2: ", req.body.newPassword2);

  if (
    !req.body.currentPassword ||
    !req.body.newPassword1 ||
    !req.body.newPassword2
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (req.body.newPassword1 !== req.body.newPassword2) {
    return res.status(400).json({ error: "New passwords do not match" });
  }

  if (
    req.body.currentPassword === req.body.newPassword1 &&
    req.body.currentPassword === req.body.newPassword2
  ) {
    return res
      .status(400)
      .json({ error: "Current and new passwords are the same" });
  }

  Account.AccountModel.generateHash(req.body.currentPassword, (salt, hash) => {
    // find currentPass
    // find req.session.account.username in mongo
    //// if doc.Password === hash, hash newPass
    //// update doc.pass and doc.salt
    //// save account
    Account.AccountModel.findByUsername(
      req.session.account.username,
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: "An error occurred" });
        }

        if (!doc) {
          return res.status(400).json({ error: "Invalid username" });
        }

        console.log("hashed currentPassword:", hash);
        console.log("doc.password", doc.password);

        console.log("passwords match?", hash === doc.password);

        if (hash === doc.password) {
          Account.AccountModel.generateHash(
            req.body.newPassword1,
            (salt1, hash1) => {
              let accountPromise;

              let account = doc;
              account.password = hash1;
              account.salt = salt1;
              accountPromise = account.save();

              accountPromise.then(() => {
                console.log("account: ", account);
                res.json({ account });
              });

              accountPromise.catch(() => {
                return res.status(400).json({ error: "An error occurred" });
              });

              return accountPromise;
            }
          );
        }
      }
    );
  });

  // see if current pwd matches the one in the db
  // take current pwd from the form, hash it, compare it to the one stored in the db
  // if they're the same, then the current password entered is correct

  // if correct current password and the new password are the same, then you dont want to change it and send back an error
  // else if 2 the new pwds are the same, then store it
};

const getToken = (request, response) => {
  const req = request;
  const res = response;
  const csrfJSON = {
    csrfToken: req.csrfToken()
  };

  res.json(csrfJSON);
};

const settingsPage = (req, res) => {
  res.render("settings", { csrfToken: req.csrfToken() });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.settingsPage = settingsPage;
module.exports.changePass = changePass;
