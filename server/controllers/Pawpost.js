const models = require("../models");

const Pawpost = models.Pawpost;

const makePawpost = (req, res) => {
  if (!req.body.content || !req.body.contentImg || !req.body.profilePic) {
    return res.status(400).json({
      error: "Pawpost content, content image, and profile pic required"
    });
  }

  const pawpostData = {
    content: req.body.content,
    contentImg: req.body.contentImg,
    profilePic: req.body.profilePic,
    owner: req.session.account._id
  };

  console.log("pawpostData: ", pawpostdata);

  const newPawpost = new Pawpost.PawpostModel(pawpostData);
  const pawpostPromise = newPawpost.save();
  pawpostPromise.then(() => res.json({ redirect: "/maker" }));
  pawpostPromise.catch(err => {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Pawpost already exists" });
    }

    return res.status(400).json({ error: "An error occurred" });
  });

  console.log("pawpostPromise", pawpostPromise);
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
    console.log("req.body._id", req.body._id);

    if (!doc) {
      return res.status(400).json({ error: "Invalid pawpost" });
    }

    console.log("doc:", doc);
    console.log("req.session.account._id", req.session.account._id);

    if (doc.owner.equals(req.session.account._id)) {
      let pawpost = doc;
      pawpost.content = req.body.content;
      pawpost.contentImg = req.body.contentImg;
      pawpost.profilePic = req.body.profilePic;
      const pawpostPromise = pawpost.save();

      pawpostPromise.then(() => {
        console.log("pawpost: ", pawpost);
        res.json({ pawpost });
      });

      pawpostPromise.catch(() => {
        return res.status(400).json({ error: "An error occurred" });
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

  return Pawpost.PawpostModel.findByOwner(
    req.session.account._id,
    (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: "An error occurred" });
      }

      return res.json({ pawposts: docs });
    }
  );
};

module.exports.makePawpost = makePawpost;
module.exports.getPawposts = getPawposts;
module.exports.makePawpost = makePawpost;
module.exports.editPawpost = editPawpost;
