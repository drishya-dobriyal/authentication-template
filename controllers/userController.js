const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const uuid = require("uuid");
const accountMailer = require("../mailers/account");
require("dotenv").config();

/* handler for Sign In */
module.exports.signIn = async function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return res.render("sign_in", {
    title: "App Name | Sign-IN",
    error_message: req.flash("error"),
  });
};

/* Handler for Sign Up */
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return res.render("sign_up", {
    title: "App Name | Sign Up",
    error_message: req.flash("error"),
  });
};

/* handler to create new user */
module.exports.create = async function (req, res, done) {
  /* Check Password if they do not match return */
  if (req.body.password != req.body.confirm_password) {
    req.flash("error", "Passwords do not match");
    return res.redirect("back");
  }

  /* Find User from database */
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      /* Create new User */
      const hashed_password = await bcrypt.hash(
        req.body.password,
        +process.env.SALT_FOR_HASH
      );
      const newUser = await User.create({
        email: req.body.email,
        name: req.body.name,
        hashed_password,
      });
      console.log("new User created: ", newUser);
      return res.redirect("/users/sign-in");
    } else {
      /* User already present */
      console.log("User already present ");
      req.flash("error", "User already present");
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Error - finding user in Signup (create): ", err);
    return res.redirect("back");
  }
};

/* handler to create session for sign in */
module.exports.createSession = function (req, res, done) {
  console.log("Login Sucessfull");
  return res.redirect("/");
};

/* Handler for Sign Out the user */
module.exports.signOut = function (req, res, done) {
  req.logout(function (err) {
    if (err) {
      console.log("Error while sign-out: ", err);
      next();
    }
    return res.redirect("/");
  });
};

/* handler for reset Password */
module.exports.resetPassword = function (req, res, done) {
  if (req.isAuthenticated()) {
    return res.render("reset_password", {
      title: "App Name | Reset Password",
      error_message: req.flash("error"),
    });
  } else {
    return res.redirect("back");
  }
};

/* Handler for Updating Password */
module.exports.updatePassword = async function (req, res, done) {
  if (req.isAuthenticated()) {
    if (req.body.newPassword != req.body.confirmPassword) {
      console.log("Error - Passwords do not match: Signup - create");
      return res.redirect("back");
    }

    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        console.log("User not found - Update Password");
        req.flash("error", "User not found");
        return res.redirect("back");
      }
      const isPasswordCorrect = await bcrypt.compare(
        req.body.oldPassword,
        user.hashed_password
      );
      if (isPasswordCorrect) {
        console.log("Password matched");
        const newHashedPassword = await bcrypt.hash(
          req.body.newPassword,
          parseInt(process.env.SALT_FOR_HASH)
        );
        /* send mail for account successfully created */
        console.log(req.body);
        await User.updateOne(
          { email: req.body.email },
          { hashed_password: newHashedPassword }
        );
        return res.redirect("/users/sign-out");
      } else {
        req.flash("error", "Please enter correct password");
        console.log("Incorrect Previous Password");
        return res.redirect("back");
      }
    } catch (err) {
      console.log("error: ", err);
      return res.redirect("back");
    }
  } else {
    return res.redirect("back");
  }
};

/* Handler for Forgot Password */
module.exports.forgotPassword = function (req, res, done) {
  return res.render("forgot_password", {
    title: "App Name | Forgot Password",
  });
};

/* handler for sending new password for user via mail */
module.exports.sendNewPassword = async function (req, res, done) {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "Email does not exists");
    res.redirect("back");
    return;
  }
  let password = crypto.randomBytes(20).toString("hex");
  const hashed_password = await bcrypt.hash(
    password,
    +process.env.SALT_FOR_HASH
  );
  await User.updateOne(
    { email: req.body.email },
    { hashed_password: hashed_password }
  );
  user.password = password;
  accountMailer.send_new_password(user);
  res.redirect("/users/sign-in");
};
