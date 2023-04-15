const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const User = require("../models/user.js");

const ops = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret",
};

passport.use(
  new JWTStrategy(ops, async function (jwtPayLoad, done) {
    try {
      let user = await User.findById(jwtPayLoad._id);
      if (err) {
        console.log("Error in finding user -> passport-jwt");
        return done(err);
      }
      if (user) {
        return done(null, user);
      }
    } catch (err) {
      return done(null, false);
    }
  })
);
module.exports = passport;
