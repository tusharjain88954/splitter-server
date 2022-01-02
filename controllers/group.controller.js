const mongoose = require("mongoose");
const passport = require("passport");
const ObjectId = mongoose.Types.ObjectId;

// lodash is used for extracting key value pairs from object
const _ = require("lodash");

const Group = mongoose.model("Group");
const user_group = mongoose.model("UserGroup");


module.exports.createGroup = async (req, res, next) => {
  var group = new Group();
  group.name = req.body.name;
  console.log(group.name);
  // group.userIds.push(req._id);
  group.save((err, doc) => {
    if (!err) {

      let User_group = new user_group();
      User_group.groupId = doc._id;
      User_group.userId = req._id;
      User_group.save((err, doc) => {
        if (!err)
          res.send(doc);
        else {
          res.status(422).json({
            status: false,
            error: "Something went wrong",
          });
        }
      });
    }
    else {
      if (err.code == 11000)
        res.status(422).json({
          status: false,
          error: "Group name already been taken ",
        });
      else return next(err);
    }
  });
};
/*

  check code of all below functions

*/
module.exports.updateGroupInfo = async (req, res, next) => {
  // email exists check
  if (req.query.purpose == "addUser") {
    const addUser = await Group.updateOne(
      { name: req.body.name },
      { $addToSet: { userIds: req._id } }
    );
    console.log(addUser);
    if (addUser.n == 0) {
      res.status(404).json({
        status: false,
        error: "Specified group name record not found.",
      });
    } else {
      res.status(202).json({ message: "Successfully Added" });
    }
  }
  else if (req.query.purpose == "addExpanse") {
    const { from, to, amount, paidBy, description } = req.body;
    console.log({ from, to, amount, paidBy, description });
    if (!from || !to || !amount || !paidBy || !description) {
      res.status(404).json({
        status: false,
        error: "please fill all necessary fields",
      });
    }

    let expanse = {
      from: from,
      to: to,
      amount: amount,
      paidBy: paidBy,
      description: description,
      date: new date()
    }




  }
  else {
    res.status(404).json({
      status: false,
      error: "Specified purpose not allowded.",
    });
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


module.exports.getGroup = async (req, res, next) => {
  const group = await Group.findOne({ _id: ObjectId(req.params.id) });
  if (group) {
    console.log(group);
    res.status(200).json(group);
  }
  else {
    res.status(404).json({
      status: false,
      error: "Specified group name record not found.",
    });
  }
};



