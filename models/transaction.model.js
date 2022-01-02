const mongoose = require("mongoose");

var transactionSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: "can't be empty", },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: "can't be empty", },
    paidTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: "can't be empty", },
    amount: {
        type: mongoose.Schema.Types.Number,
        default: 0
    }
});
//defining the index
transactionSchema.index(
    { groupId: 1, paidBy: 1, paidTo: 1 },
    {
        unique: true,
    }
);
// Events

// Methods

mongoose.model("Transaction", transactionSchema);
