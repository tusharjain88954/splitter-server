const mongoose = require("mongoose");

var userGroupSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: "can't be empty", },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: "can't be empty", },
    youOwe: { type: mongoose.Schema.Types.Number },
    youAreOwned: { type: mongoose.Schema.Types.Number }
});
//defining the index
userGroupSchema.index(
    { userId: 1, groupId: 1 },
    {
        unique: true,
    }
);

// Events

// Methods

mongoose.model("UserGroup", userGroupSchema);
