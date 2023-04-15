const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/user");
require("dotenv").config();

/* tell passport to use a new strategy for google login */
passport.use(
  new googleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.CLIENT_URL}/users/auth/google/callback`,
    },

    async function (accessToken, refreshToken, profile, done) {
      // find a user
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          // if found, set this user as req.user
          return done(null, user);
        }
        let password = crypto.randomBytes(20).toString("hex");
        const hashed_password = await bcrypt.hash(
          password,
          parseInt(process.env.SALT_FOR_HASH)
        );
        user = await User.create({
          email: profile.emails[0].value,
          hashed_password,
          name: profile._json.name,
        });
        console.log(user);
        return done(null, user);
      } catch (err) {
        console.log("error in google strategy-passport", err);
        return done(null, false);
      }
    }
  )
);

module.exports = passport;
