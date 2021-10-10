const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    unique: true,
    required: "name can't be empty",
  },

  userIds: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
  total_transactions: {
    type: [String],
  },
  expanses: {
    type: [String],
  },
});

// Events

// Methods

mongoose.model("Group", userSchema);
