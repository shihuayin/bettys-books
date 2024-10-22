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
// router.get("/logout", redirectLogin, (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.redirect("./");
//     }
//     res.send("you are now logged out. <a href=" + "./" + ">Home</a>");
//   });
// });

router.get("/logout", (req, res) => {
  // Check if the user is logged in
  if (!req.session.userId) {
    // If not logged in, show a message
    return res.send("You are already logged out. <a href='./'>Home</a>");
  }

  // Destroy the session if the user is logged in
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("./");
    }
    // Inform the user they have logged out and provide a link to the home page
    res.send("You have logged out. <a href='./'>Home</a>");
  });
});

// Export the router object so index.js can access it
module.exports = router;
