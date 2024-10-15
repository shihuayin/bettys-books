// Create a new router
const express = require("express");
const router = express.Router();

// Task 5:  Add a Logout route to your main.js file
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("./login"); // redirect to the login page
  } else {
    next(); // move to the next middleware function
  }
};

// Handle our routes
router.get("/", function (req, res, next) {
  res.render("index.ejs");
});

router.get("/about", function (req, res, next) {
  res.render("about.ejs");
});

//task 5
//logout route
router.get("/logout", redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("./");
    }
    res.send("you are now logged out. <a href=" + "./" + ">Home</a>");
  });
});

// Export the router object so index.js can access it
module.exports = router;
