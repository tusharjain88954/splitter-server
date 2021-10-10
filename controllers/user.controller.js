const mongoose = require("mongoose");
const passport = require("passport");
// lodash is used for extracting key value pairs from object
const _ = require("lodash");

const User = mongoose.model("User");
const Group = mongoose.model("Group");

module.exports.register = async (req, res, next) => {
  var user = new User();
  user.fullName = req.body.fullName;
  user.email = req.body.email;
  user.password = req.body.password;
  user.save((err, doc) => {
    if (!err) res.send(doc);
    else {
      if (err.code == 11000)
        res.status(422).send(["Duplicate email adrress found."]);
      else return next(err);
    }
  });
};

module.exports.authenticate = (req, res, next) => {
  // call for passport authentication
  passport.authenticate("local", (err, user, info) => {
    // error from passport middleware
    if (err) return res.status(400).json(err);
    // registered user
    else if (user) return res.status(200).json({ token: user.generateJwt() });
    // unknown user or wrong password
    else return res.status(404).json(info);
  })(req, res);
};

module.exports.userProfile = async (req, res, next) => {
  await User.findOne({ _id: req._id }, (err, user) => {
    if (!user)
      return res
        .status(404)
        .json({ status: false, message: "User record not found." });
    else
      return res
        .status(200)
        .json({ status: true, user: _.pick(user, ["fullName", "email"]) });
  });
};

module.exports.getGroupList = async (req, res, next) => {
  const groupList = await User.aggregate([
    {
      $lookup: {
        from: "Group",
        localField: "groupIds",
        foreignField: "_id",
        as: "groups",
      },
    },
    { $project: { expanses: 0, userIds: 0, total_transactions: 0 } },
  ]);
  return res.status(200).json(groupList);
};

module.exports.addGroup = async (req, res, next) => {
  const group = await Group.findOne({ name: req.body.name });

  if (group) {
    console.log(group._id);

    const addGroup = await User.updateOne(
      { _id: req._id },
      { $addToSet: { groupIds: group._id } }
    );
    if (addGroup.n == 0) {
      res.status(404).json({
        status: false,
        message: "Specified User record not found.",
      });
    } else {
      res.status(202).send(["Added Successfully"]);
    }
  } else {
    res.status(404).json({
      status: false,
      message: "Specified group name record not found.",
    });
  }
};
