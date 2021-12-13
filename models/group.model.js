const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    unique: true,
    required: "name can't be empty",
  },

  total_transactions: {
    type: [String],
  },
  expanses: {
    type: [String],
  },
  total_persons: {
    type: mongoose.Schema.Types.Number,
    default: 1
  }
});

// Events

// Methods

mongoose.model("Group", userSchema);
