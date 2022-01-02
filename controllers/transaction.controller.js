const mongoose = require("mongoose");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const ObjectId = mongoose.Types.ObjectId;
// lodash is used for extracting key value pairs from object
const _ = require("lodash");

const User = mongoose.model("User");
const Group = mongoose.model("Group");
const user_group = mongoose.model("UserGroup");
const transaction = mongoose.model("Transaction");

module.exports.addTransaction = async (req, res, next) => {
    const { userIds, description, amount, payeeIds, splitEqually, payeeDetails, date } = req.body;
    // console.log({ userIds, description, amount, payeeIds, splitEqually, payeeDetails, date });

    let totalAmount = 0;
    for (let i = 0; i < payeeDetails.length; i++) {
        totalAmount += payeeDetails[i]["amount"];
    }
    if (!splitEqually && totalAmount != amount) {
        res.status(406).json({
            status: false,
            error: `The total of everyone paid share (${totalAmount}) is different than the total cost (${amount})`,
        });
    }
    else if (userIds.length == 0) {
        res.status(406).json({
            status: false,
            error: 'transaction should be inbetween of two or more people',
        });
    }
    else {
        console.log(splitTransaction(req.body, req._id));
        res.status(202).json({ message: "Successfully Added" });
    }
};

function splitTransaction(body, currentUserId) {
    const { userIds, description, amount, payeeIds, splitEqually, payeeDetails, date } = body;
    let perPersonAmount = (amount / (userIds.length + 1));
    let payees = []; // [{"paidBy" : "userId", "amount" : 200}];
    let payeeObj = new Object();
    payeeObj["paidBy"] = currentUserId;
    payeeObj["amount"] = perPersonAmount;
    payees.push(payeeObj);
    for (let i = 0; i < userIds.length; i++) {
        let payeeObj = new Object();
        payeeObj["paidBy"] = userIds[i];
        payeeObj["amount"] = perPersonAmount;
        payees.push(payeeObj);
    }
    for (let i = 0; i < payeeDetails.length; i++) {
        for (let j = 0; j < payees.length; j++) {
            // console.log(payeeDetails[i]["_id"], payees[j]["paidBy"], currentUserId);
            if (payeeDetails[i]["_id"] == "defaultId" && currentUserId == payees[j]["paidBy"]) {
                payees[j]["amount"] -= payeeDetails[i]["amount"];
            }
            if (payeeDetails[i]["_id"] == payees[j]["paidBy"]) {
                payees[j]["amount"] -= payeeDetails[i]["amount"];
            }
        }
    }
    // console.log(payees);

    // separate borrower (positive amount) and lender (negative amount);

    let lender = [];
    let borrower = [];
    for (let i = 0; i < payees.length; i++) {
        // remove those users who have to pay/recieve zero amount
        if (payees[i]["amount"] > 0) {
            borrower.push(payees[i]);
        }
        else if (payees[i]["amount"] < 0) {
            lender.push(payees[i]);
        }
    }
    // console.log("above");
    console.log(lender);
    console.log(borrower);
    // console.log("below");



    let transactionDetails = []; // [{"paidBy" : "userId", "paidTo" : "userId", "amount" : 200}];
    while (lender.length) {
        while (lender[0]["amount"]) {
            if (Math.abs(lender[0]["amount"]) >= borrower[0]["amount"]) {
                lender[0]["amount"] += borrower[0]["amount"]
                // add transactionDetails
                let transactionObj = new Object();
                transactionObj["paidBy"] = lender[0]["paidBy"];
                transactionObj["paidTo"] = borrower[0]["paidBy"];
                transactionObj["amount"] = borrower[0]["amount"]
                transactionDetails.push(transactionObj);
                borrower.splice(0, 1); // pop the first element;
            }
            else {
                borrower[0]["amount"] += lender[0]["amount"];
                let transactionObj = new Object();
                transactionObj["paidBy"] = lender[0]["paidBy"];
                transactionObj["paidTo"] = borrower[0]["paidBy"];
                transactionObj["amount"] = lender[0]["amount"];
                lender[0]["amount"] = 0;
                transactionDetails.push(transactionObj);
            }
        }
        lender.splice(0, 1); // pop the first element
    }

    return transactionDetails;
}