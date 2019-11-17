const models = require("../models");

const Pawpost = models.Pawpost;

const makePawpost = (req, res) => {
  if (!req.body.postContent) {
    return res.status(400).json({
      error: "Pawpost content required"
    });
  }

  const pawpostData = {
    content: req.body.postContent,
    contentImg: req.body.contentImg,
    profilePic: req.body.profilePic,
    owner: req.session.account._id,
    username: req.session.account.username
  };

  console.log("data", pawpostData);
  const newPawpost = new Pawpost.PawpostModel(pawpostData);
  const pawpostPromise = newPawpost.save();
  pawpostPromise.then(() => res.json({ redirect: "/feed" }));
  pawpostPromise.catch(err => {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Pawpost already exists" });
    }

    return res.status(400).json({ error: "An error occurred" });
  });

  console.log("pawpostData", pawpostData);

  return pawpostPromise;
};

const editPawpost = (request, response) => {
  const req = request;
  const res = response;

  Pawpost.PawpostModel.findById(req.body._id, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "An error occurred" });
    }

    if (!doc) {
      return res.status(400).json({ error: "Invalid pawpost" });
    }

    let pawpostPromise;
    if (doc.owner.equals(req.session.account._id)) {
      let pawpost = doc;
      console.log("req.body.contentEdit", req.body.contentEdit);
      pawpost.content = req.body.contentEdit;
      pawpost.contentImg = req.body.contentImgEdit;
      pawpost.profilePic = req.body.profilePicEdit;
      pawpostPromise = pawpost.save();

      console.log("pawpost in controller before then: ", pawpost);

      pawpostPromise.then(() => {
        console.log("pawpost in controller: ", pawpost);
        res.json({ pawpost });
      });

      pawpostPromise.catch(() => {
        return res.status(400).json({ error: "An error occurred21123" });
      });

      return pawpostPromise;
    }

    return pawpostPromise;
  });
};

const feedPage = (req, res) => {
  Pawpost.PawpostModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "An error occurred" });
    }

    console.log("docs", docs);

    return res.render("app", { csrfToken: req.csrfToken(), pawposts: docs });
  });
};

const getPawposts = (request, response) => {
  const req = request;
  const res = response;

  // const username = `${Account.AccountModel.toAPI.username}`;
  // console.log("username: ", username);
  // console.log("username: ", req.session.account.username);

  return Pawpost.PawpostModel.findByOwner(
    req.session.account._id,
    (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: "An error occurred" });
      }
      console.log("get docs: ", docs);

      return res.json({ pawposts: docs });
    }
  );
};

module.exports.makePawpost = makePawpost;
module.exports.getPawposts = getPawposts;
module.exports.feedPage = feedPage;
module.exports.editPawpost = editPawpost;
