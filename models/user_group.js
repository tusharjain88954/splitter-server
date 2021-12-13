const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    youOwe: { type: mongoose.Schema.Types.Number },
    youAreOwned: { type: mongoose.Schema.Types.Number }
});
//defining the index
userSchema.index(
    { userId: 1, groupId: 1 },
    {
        unique: true,
    }
);

// Events

// Methods

mongoose.model("user_group", userSchema);
