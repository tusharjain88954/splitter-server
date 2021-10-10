const express = require("express");
const router = express.Router();

const ctrlUser = require("../controllers/user.controller");
const ctrlGroup = require("../controllers/group.controller");
const jwtHelper = require("../config/jwtHelper");

router.post("/register", ctrlUser.register); // signup
router.post("/authenticate", ctrlUser.authenticate); // signin
router.get("/userProfile", jwtHelper.verifyJwtToken, ctrlUser.userProfile); // userinfo
router.get("/group", jwtHelper.verifyJwtToken, ctrlGroup.getGroup); // get a group info
router.get("/user", jwtHelper.verifyJwtToken, ctrlUser.getGroupList); // get list if groups in which a user is joined
router.post("/group", jwtHelper.verifyJwtToken, ctrlGroup.createGroup);
router.patch("/group", jwtHelper.verifyJwtToken, ctrlGroup.addUser); // add a user into a group doc
router.patch("/user", jwtHelper.verifyJwtToken, ctrlUser.addGroup); // add a group into user doc

module.exports = router;
