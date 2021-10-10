const mongoose = require("mongoose");
const passport = require("passport");
// lodash is used for extracting key value pairs from object
const _ = require("lodash");

const Group = mongoose.model("Group");

module.exports.getGroup = async (req, res, next) => {
  const group = await Group.findOne({ name: req.body.name });
  if (group) res.status(200).json(group);
  else
    res.status(404).json({
      status: false,
      message: "Specified group name record not found.",
    });
};

module.exports.createGroup = async (req, res, next) => {
  var group = new Group();
  group.name = req.body.name;
  group.save((err, doc) => {
    if (!err) res.send(doc);
    else {
      if (err.code == 11000)
        res.status(422).send(["group name already been taken"]);
      else return next(err);
    }
  });
};

module.exports.addUser = async (req, res, next) => {
  // email exists check
  const addUser = await Group.updateOne(
    { name: req.body.name },
    { $addToSet: { userIds: req._id } }
  );
  console.log(addUser);
  if (addUser.n == 0) {
    res.status(404).json({
      status: false,
      message: "Specified group name record not found.",
    });
  } else {
    res.status(202).send(["Added Successfully"]);
  }
};
