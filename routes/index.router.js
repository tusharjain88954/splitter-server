const express = require("express");
const router = express.Router();

const ctrlUser = require("../controllers/user.controller");
const ctrlGroup = require("../controllers/group.controller");
const ctrlUserGroup = require("../controllers/user_group.controller")
const ctrlTransaction = require("../controllers/transaction.controller")
const auth = require("../config/authenticate");

router.post("/register", ctrlUser.register); // signup
router.post("/authenticate", ctrlUser.authenticate); // signin
router.get("/userProfile", auth.verifyJwtToken, ctrlUser.userProfile); // userinfo
router.patch(
  "/userProfile",
  auth.verifyJwtToken,
  ctrlUser.updateUserProfile
); // update user info
router.get("/user", auth.verifyJwtToken, ctrlUser.getGroupList); // get list if groups in which a user is joined
router.patch("/user", auth.verifyJwtToken, ctrlUser.addGroup); // add a group into user doc
router.delete("/user", auth.verifyJwtToken, ctrlUser.removeGroup); // remove a group from a user doc
router.get("/group/:id", auth.verifyJwtToken, auth.verifyGroup, ctrlGroup.getGroup); // get a group name and all user names
router.post("/group", auth.verifyJwtToken, ctrlGroup.createGroup);
router.patch("/group", auth.verifyJwtToken, ctrlGroup.updateGroupInfo); // add a user into a group doc
router.delete("/group", auth.verifyJwtToken, ctrlGroup.removeUser); // remove a user from a group doc
router.get("/user_group", auth.verifyJwtToken, auth.verifyGroup, ctrlUserGroup.getAllUsers); // get all users of a particular group
router.post("/user_group", auth.verifyJwtToken, ctrlUserGroup.createUserGroup);
router.post("/transaction", auth.verifyJwtToken, auth.verifyGroup, ctrlTransaction.addTransaction);
/*
make unecessary request as method not allowded!
put every controller code in try-catch and handle server errors and show that error on frontend also
*/
module.exports = router;
