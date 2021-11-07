const mongoose = require("mongoose");
const passport = require("passport");
// lodash is used for extracting key value pairs from object
const _ = require("lodash");

const Group = mongoose.model("Group");

module.exports.getGroup = async (req, res, next) => {
  const group = await Group.aggregate([
    { $match: { name: req.query.name } },
    {
      $addFields: {
        totalUsers: { $size: "$userIds" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userIds",
        foreignField: "_id",
        as: "users",
      },
    },
    {
      $project: {
        total_transactions: 0,
        expanses: 0,
        __v: 0,
        _id: 0,
        "users._id": 0,
        "users.email": 0,
        "users.password": 0,
        "users.saltSecret": 0,
        "users.__v": 0,
        "users.groupIds": 0,
      },
    },
  ]);
  if (group) res.status(200).json(group);
  else
    res.status(404).json({
      status: false,
      message: "Specified group name record not found.",
    });
};

module.exports.createGroup = async (req, res, next) => {
  var group = new Group();
  group.name = req.query.name;
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
    { name: req.query.name },
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

module.exports.removeUser = async (req, res, next) => {
  // email exists check
  const removeUser = await Group.updateOne(
    { name: req.query.name },
    { $pull: { userIds: req._id } }
  );
  console.log(removeUser);
  if (removeUser.n == 0) {
    res.status(404).json({
      status: false,
      message: "Specified group name record not found.",
    });
  } else {
    res.status(202).send(["removed Successfully"]);
  }
};
