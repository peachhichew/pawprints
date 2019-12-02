const models = require("../models");

const Pawpost = models.Pawpost;

// Create a new pawpost on the page by grabbing the data from the
// form and saving it to the db.
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

  const newPawpost = new Pawpost.PawpostModel(pawpostData);
  const pawpostPromise = newPawpost.save();
  pawpostPromise.then(() => res.json({ redirect: "/profile" }));
  pawpostPromise.catch(err => {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Pawpost already exists" });
    }

    return res.status(400).json({ error: "An error occurred" });
  });

  return pawpostPromise;
};

// To let the user edit their pawposts, we need to find the
// account id and check that it matches the id of the owner.
// If it does, we can update the appropriate fields and save
// that to the db.
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

    console.log("doc in editPawpost(): ", doc);

    let pawpostPromise;
    if (doc.owner.equals(req.session.account._id)) {
      let pawpost = doc;
      pawpost.content = req.body.contentEdit;
      pawpost.contentImg = req.body.contentImgEdit;
      pawpost.profilePic = req.body.profilePicEdit;
      pawpostPromise = pawpost.save();

      pawpostPromise.then(() => {
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

const deletePawpost = (request, response) => {
  const req = request;
  const res = response;

  Pawpost.PawpostModel.findById(req.body._id, (err, doc) => {
    console.log("doc: ", doc);
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "An error occurred" });
    }

    if (!doc) {
      return res.status(400).json({ error: "Invalid pawpost" });
    }

    return Pawpost.PawpostModel.remove({ _id: req.body._id }, error => {
      if (error) {
        console.log(err);
        return res.status(400).json({ error: "An error occurred" });
      }

      // res.redirect("/feed");
      // return res.render("app", { csrfToken: req.csrfToken() });
      return res.status(200).json({ message: "Pawpost successfully deleted" });
    });
  });
};

// Renders the /profile page and all the existing pawposts
const profilePage = (req, res) => {
  Pawpost.PawpostModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "An error occurred" });
    }

    return res.render("app", { csrfToken: req.csrfToken(), pawposts: docs });
  });
};

const feedPage = (req, res) => {
  return Pawpost.PawpostModel.findByOwner(
    req.session.account._id,
    (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: "An error occurred" });
      } else {
        res.render("app", {
          csrfToken: req.csrfToken(),
          pawposts: docs
        });
        return;
      }
    }
  );
};

const getAllUsersPawposts = (req, res) => {
  return Pawpost.PawpostModel.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "An error occurred" });
    } else {
      res.json({ pawposts: docs });
    }
  });
};

// Retrieves each pawpost by finding the associated account owner id
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
module.exports.profilePage = profilePage;
module.exports.feedPage = feedPage;
module.exports.editPawpost = editPawpost;
module.exports.deletePawpost = deletePawpost;
module.exports.getAllUsersPawposts = getAllUsersPawposts;
