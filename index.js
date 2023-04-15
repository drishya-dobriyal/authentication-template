/* Require Modules */
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy.js");
const db = require("./config/mongoose");
const passportJWT = require("./config/passport-jwt.js");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const MongoStore = require("connect-mongo");
const expressLayouts = require("express-ejs-layouts");
var flash = require("connect-flash");
require("dotenv").config();

/* Create app */
const app = express();

/* Port For listening */
const port = 8000;

/* Config express to use body parser as middle ware */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Use cookie parser */
app.use(cookieParser());

/* Use assets for static folder */
app.use(express.static("./assets"));
app.use(flash());
app.use(expressLayouts);

// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

/* Mongo db is use to store session key */
app.use(
  session({
    name: "project",
    secret: "project",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl: "mongodb://localhost/project",
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup");
      }
    ),
  })
);

/* Set passport for authentication */
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

/* set view engine */
app.set("view engine", "ejs");
app.set("views", "./views");

/* use static file */
app.use("/public", express.static("public"));

/* Use Router */
app.use("/", require("./routes"));

/* Listen to app */
app.listen(port, (err) => {
  if (err) {
    console.log(`Error while listening to server: ${err}`);
  }
  console.log(`App listenning to Port - ${port}`);
});
