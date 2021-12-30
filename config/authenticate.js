const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const user_group = mongoose.model("user_group");

module.exports.verifyJwtToken = (req, res, next) => {
  var token;
  if ("authorization" in req.headers)
    token = req.headers["authorization"].split(" ")[1];

  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });
  else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res
          .status(500)
          .send({ auth: false, message: "Token authentication failed." });
      else {
        req._id = decoded._id;
        next();
      }
    });
  }
};


module.exports.verifyGroup = async (req, res, next) => {
  const groupId = req.params.id;

  if (!groupId)
    return res.status(403).json({ auth: false, error: "No Id found" });
  else {
    const userGroup = await user_group.findOne({ groupId: req.params.id, userId: req._id });
    console.log(userGroup)
    if (userGroup) next();
    else {
      return res
        .status(500)
        .json({ auth: false, error: "Group authentication failed." });
    }
  }
};
