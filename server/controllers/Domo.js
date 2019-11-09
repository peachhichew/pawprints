const models = require("../models");

const Domo = models.Domo;

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.favoriteFood) {
    return res
      .status(400)
      .json({ error: "RAWR! Name, age, and favorite food are required" });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    favoriteFood: req.body.favoriteFood,
    owner: req.session.account._id
  };

  console.log("domoData: ", domoData);

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: "/maker" }));

  domoPromise.catch(err => {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Domo already exists" });
    }

    return res.status(400).json({ error: "An error occurred" });
  });

  console.log("domoPromise", domoPromise);

  return domoPromise;
};

const editDomo = (request, response) => {
  console.log("inside editDomo");
  const req = request;
  const res = response;

  // look up domo by id
  // check that owner = req.session.account._id
  // update domo if the above is true

  Domo.DomoModel.findById(req.body._id, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "An error occurred" });
    }
    console.log("req.body._id", req.body._id);

    if (!doc) {
      return res.status(400).json({ error: "invalid domo" });
    }

    console.log("doc:", doc);
    console.log("req.session.account._id", req.session.account._id);
    console.log(
      "doc.owner == req.session.account._id",
      doc.owner == req.session.account._id
    );
    if (doc.owner == req.session.account._id) {
      let domo = doc;
      domo.name = req.body.name;
      domo.age = req.body.age;
      domo.favoriteFood = req.body.favoriteFood;
      const domoPromise = domo.save();

      domoPromise.then(() => {
        console.log("domo: ", domo);
        res.json({ domo });
      });

      domoPromise.catch(err => {
        return res.status(400).json({ error: "An error occurred" });
      });

      return domoPromise;
    }
  });
};

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "An error occurred" });
    }

    console.log("docs", docs);

    return res.render("app", { csrfToken: req.csrfToken(), domos: docs });
  });
  // res.render("app");
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "An error occurred" });
    }

    return res.json({ domos: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.make = makeDomo;
module.exports.edit = editDomo;
