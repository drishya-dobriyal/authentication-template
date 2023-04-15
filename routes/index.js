const express = require("express");
const router = express.Router();
const passport = require("passport");

const homeController = require("../controllers/homeController.js");

/* Route for Home Handler */
router.get("/", passport.checkAuthentication, homeController.home);
/* Route Users */
router.use("/users", require("./users"));

module.exports = router;
