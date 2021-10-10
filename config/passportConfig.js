const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

var User = mongoose.model("User");

passport.use(
  new localStrategy({ usernameField: "email" }, async(username, password, done) => {
    await User.findOne({ email: username }, (err, user) => {
      if (err) return done(err);
      // unknown user
      else if (!user)
        return done(null, false, { message: "Email is not registered" });
      // wrong password
      else if (!user.verifyPassword(password))
        return done(null, false, { message: "Invalid Credentials" });
      // authentication succeeded
      else return done(null, user);
    });
  })
);
