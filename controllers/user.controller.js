const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const ObjectId = mongoose.Types.ObjectId;
// lodash is used for extracting key value pairs from object
const _ = require("lodash");

const User = mongoose.model("User");
const Group = mongoose.model("Group");
const user_group = mongoose.model("user_group");

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

module.exports.updateUserProfile = async (req, res, next) => {
  // if any field is empty, it means that field is undefined.
  let { fullName, password, confirmPassword } = req.body;
  let saltSecret = "";
  if (!fullName && !password && !confirmPassword) {
    return res
      .status(422)
      .json({ error: "Please fill all the neccesary fields" });
  } else if (fullName && password && confirmPassword) {
    if (password == confirmPassword) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          password = hash;
          saltSecret = salt;
          const updateUserProfile = await User.updateOne(
            { _id: req._id },
            { fullName: fullName, password: password, saltSecret: saltSecret }
          );
          return res
            .status(200)
            .json({ message: "Successfully Updated fullName and Password" });
        });
      });
    } else {
      return res
        .status(422)
        .json({ error: "Password and Confirm Password doesn't match" });
    }
  } else if ((password && !confirmPassword) || (!password && confirmPassword)) {
    return res
      .status(422)
      .json({ error: "Password and Confirm Password doesn't match" });
  } else if (fullName) {
    const updateUserProfile = await User.updateOne(
      { _id: req._id },
      { fullName: fullName }
    );
    return res.status(200).json({ message: "Successfully Updated fullName" });
  } else if (password && confirmPassword) {
    if (password == confirmPassword) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          password = hash;
          saltSecret = salt;
          const updateUserProfile = await User.updateOne(
            { _id: req._id },
            { password: password, saltSecret: saltSecret }
          );
          return res
            .status(200)
            .json({ message: "Successfully Updated Password" });
        });
      });
    } else {
      return res
        .status(422)
        .json({ error: "Password and Confirm Password doesn't match" });
    }
  } else {
    return res
      .status(422)
      .json({ error: "Please fill all the neccesary fields" });
  }
};

module.exports.getGroupList = async (req, res, next) => {
  const groupList = await user_group.aggregate([
    { $match: { userId: ObjectId(req._id) } },
    {
      $lookup: {
        from: "groups",
        localField: "groupId",
        foreignField: "_id",
        as: "group",
      },
    },
    {
      $project: {
        groupId: 0,
        userId: 0,
        __v: 0,
        _id: 0,
        "groups.__v": 0,
        "groups.total_transactions": 0,
        "groups.expanses": 0,
      },
    },
  ]);
  return res.status(200).json(groupList);
};




/*

  check code of all below functions

*/
module.exports.addGroup = async (req, res, next) => {
  const group = await Group.findOne({ name: req.body.name });
  if (group) {
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
      res.status(202).json({ message: "Successfully Added" });
    }
  } else {
    res.status(404).json({
      status: false,
      message: "Specified group name record not found.",
    });
  }
};

module.exports.removeGroup = async (req, res, next) => {
  const group = await Group.findOne({ name: req.query.name });
  if (group) {
    const removeGroup = await User.updateOne(
      { _id: req._id },
      { $pull: { groupIds: group._id } }
    );
    if (removeGroup.n == 0) {
      res.status(404).json({
        status: false,
        message: "Specified User record not found.",
      });
    } else {
      res.status(202).send(["removed Successfully"]);
    }
  } else {
    res.status(404).json({
      status: false,
      message: "Specified group name record not found.",
    });
  }
};
