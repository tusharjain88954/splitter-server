const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const ObjectId = mongoose.Types.ObjectId;
// lodash is used for extracting key value pairs from object
const _ = require("lodash");

const User = mongoose.model("User");
const Group = mongoose.model("Group");
const user_group = mongoose.model("UserGroup");


module.exports.createUserGroup = async (req, res, next) => {
    const group = await Group.findOne({ name: req.body.name });
    if (group) {

        const alreadyExists = await user_group.findOne({ groupId: group._id, userId: req._id });
        if (alreadyExists) {
            res.status(400).json({
                status: false,
                error: "Already in the group",
            });
        }
        else {
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
        }
    } else {
        res.status(404).json({
            status: false,
            error: "Specified group name record not found.",
        });
    }
};
module.exports.getAllUsers = async (req, res, next) => {
    console.log("iddhar")
    const group = await Group.findOne({ _id: ObjectId(req.query.groupId) });
    if (group) {
        const allUserGroups = await user_group.find({ groupId: ObjectId(req.query.groupId) });
        // send user name and their ids in json format
        let allUserIds = [];
        for (let i = 0; i < allUserGroups.length; i++) {
            allUserIds.push(allUserGroups[i].userId);
        }
        const allUsers = await User.find({ _id: { $in: allUserIds } }, { email: 0, password: 0, saltSecret: 0, __v: 0 });
        let result = [];
        for (let i = 0; i < allUsers.length; i++) {
            if (allUsers[i]._id == req._id) { continue; }
            result.push(allUsers[i]);
        }
        console.log(result);
        res.status(200).send(result);
    } else {
        res.status(404).json({
            status: false,
            error: "Specified group name record not found.",
        });
    }
};