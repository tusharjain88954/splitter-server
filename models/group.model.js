const mongoose = require("mongoose");

var groupSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    unique: true,
    required: "name can't be empty",
  },

  allTransaction: {
    type: [String],
  },
  total_persons: {
    type: mongoose.Schema.Types.Number,
    default: 1
  }
});

// Events

// Methods

mongoose.model("Group", groupSchema);
