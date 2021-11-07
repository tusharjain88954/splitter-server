const express = require("express");
const router = express.Router();

const ctrlUser = require("../controllers/user.controller");
const ctrlGroup = require("../controllers/group.controller");
const jwtHelper = require("../config/jwtHelper");

router.post("/register", ctrlUser.register); // signup
router.post("/authenticate", ctrlUser.authenticate); // signin
router.get("/userProfile", jwtHelper.verifyJwtToken, ctrlUser.userProfile); // userinfo
router.patch(
  "/userProfile",
  jwtHelper.verifyJwtToken,
  ctrlUser.updateUserProfile
); // update user info
router.get("/user", jwtHelper.verifyJwtToken, ctrlUser.getGroupList); // get list if groups in which a user is joined
router.patch("/user", jwtHelper.verifyJwtToken, ctrlUser.addGroup); // add a group into user doc
router.delete("/user", jwtHelper.verifyJwtToken, ctrlUser.removeGroup); // remove a group from a user doc
router.get("/group", jwtHelper.verifyJwtToken, ctrlGroup.getGroup); // get a group name and all user names
router.post("/group", jwtHelper.verifyJwtToken, ctrlGroup.createGroup);
router.patch("/group", jwtHelper.verifyJwtToken, ctrlGroup.addUser); // add a user into a group doc
router.delete("/group", jwtHelper.verifyJwtToken, ctrlGroup.removeUser); // remove a user from a group doc

/*
make unecessary request as method not allowded!
*/
module.exports = router;
