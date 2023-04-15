const express = require("express");
const passport = require("passport");
const router = express.Router();
/* Use controller */
const usersController = require("../controllers/userController.js");

/* Route to Sign-in Page Handler*/
router.get("/sign-in", usersController.signIn);

/* Route to Sign-Up Page Handler */
router.get("/sign-up", usersController.signUp);

/* Route to Sign-Out Page Handler */
router.get("/sign-out", usersController.signOut);

/* Route to Reset Password Page Handler */
router.get("/reset-password", usersController.resetPassword);

/* Route to Update Password Page Handler */
router.post("/update-password", usersController.updatePassword);

/* Route to Create new User Page Handler */
router.post("/create", usersController.create);

/* Route to Session creation Using Passport Handler */
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

/* Route to Authenticate User Using Google Page Handler */
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/* Route for Google Sign - up  Handler*/
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

/* Route to Forgot Password Page Handler */
router.get("/forgot-password", usersController.forgotPassword);

/* Route to New Password Page Handler */
router.post("/send-new-password", usersController.sendNewPassword);

module.exports = router;
