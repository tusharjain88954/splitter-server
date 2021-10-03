const express = require("express");
const router = express.Router();

const ctrlUser = require("../controllers/user.controller");
const jwtHelper = require("../config/jwtHelper");

router.post("/register", ctrlUser.register); // signup
router.post("/authenticate", ctrlUser.authenticate); // signin
router.get("/userProfile", jwtHelper.verifyJwtToken, ctrlUser.userProfile);

module.exports = router;
