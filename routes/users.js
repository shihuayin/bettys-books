// Import required modules
const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const router = express.Router();
const saltRounds = 10;

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/login"); // redirect to the login page
  } else {
    next(); // move to the next middleware function
  }
};

// Registration page
router.get("/register", function (req, res, next) {
  res.render("register.ejs");
});

router.post("/registered", function (req, res, next) {
  const plainPassword = req.body.password;

  bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
    if (err) {
      return res.status(500).send("Hashing failed");
    }

    const userData = {
      firstName: req.body.first,
      lastName: req.body.last,
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    };

    const sql =
      "INSERT INTO users (username, first_name, last_name, email, hashed_password) VALUES (?, ?, ?, ?, ?)";
    const values = [
      userData.username,
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.password,
    ];

    db.query(sql, values, function (err, result) {
      if (err) {
        console.error("Failed to save user data:", err);
        return res.status(500).send("Failed to save user data");
      }

      let resultMessage =
        "Hello " +
        req.body.first +
        " " +
        req.body.last +
        ", you have successfully registered! We will send an email to " +
        req.body.email;
      res.send(resultMessage);
    });
  });
});

// Login page
router.get("/login", function (req, res, next) {
  res.render("login.ejs");
});

router.post("/loggedin", function (req, res, next) {
  const inputUsername = req.body.username;
  const inputPassword = req.body.password;

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [inputUsername], function (err, results) {
    if (err) {
      console.error("Failed to retrieve user data from the database:", err);
      return res.status(500).send("Failed to retrieve user data");
    }

    if (results.length === 0) {
      return res
        .status(401)
        .send("Login failed: Incorrect username or password");
    }

    // Compare passwords
    const hashedPassword = results[0].hashed_password;
    bcrypt.compare(inputPassword, hashedPassword, function (err, result) {
      if (err) {
        console.error("Password comparison failed:", err);
        return res.status(500).send("Password comparison failed");
      }

      if (result) {
        // Save user session if user login success
        req.session.userId = req.body.username;

        res.send("Success, welcome back!");
      } else {
        res.status(401).send("Login failed: Incorrect username or password");
      }
    });
  });
});

// Get user list
router.get("/list", redirectLogin, function (req, res, next) {
  const sql = "SELECT username, first_name, last_name, email FROM users";

  db.query(sql, function (err, results) {
    if (err) {
      console.error("Failed to retrieve user data:", err);
      return res.status(500).send("Failed to retrieve user data");
    }

    res.render("userlist.ejs", { users: results });
  });
});

module.exports = router;
