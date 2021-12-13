const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const ObjectId = mongoose.Types.ObjectId;
// lodash is used for extracting key value pairs from object
const _ = require("lodash");

const User = mongoose.model("User");
const Group = mongoose.model("Group");
const user_group = mongoose.model("user_group");


module.exports.createUserGroup = async (req, res, next) => {
    const group = await Group.findOne({ name: req.body.name });
    if (group) {
        await Group.updateOne({ _id: group._id }, { $inc: { "total_persons": 1 } });
        let User_group = new user_group();
        User_group.groupId = group._id;
        User_group.userId = req._id;
        User_group.save((err, doc) => {
            if (!err) {
                res.send(doc);
            }
            else {
                res.status(404).json({
                    status: false,
                    error: "Something went wrong. Contact Admin",
                });
            }
        });
    } else {
        res.status(404).json({
            status: false,
            error: "Specified group name record not found.",
        });
    }
};