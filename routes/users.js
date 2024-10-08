// Create a new router
const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const saltRounds = 10;

router.get("/register", function (req, res, next) {
  res.render("register.ejs");
});

router.post("/registered", function (req, res, next) {
  const plainPassword = req.body.password;

  bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
    if (err) {
      return res.status(500).send("Error hashing password");
    }

    // Store hashed password in your database here
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
        console.error("Error saving user data to the database:", err);
        return res.status(500).send("Error saving user data");
      }
      console.log("User data saved to the database:", result);

      let resultMessage =
        "Hello " +
        req.body.first +
        " " +
        req.body.last +
        " you are now registered! We will send an email to you at " +
        req.body.email;
      resultMessage +=
        " Your password is: " +
        req.body.password +
        " and your hashed password is: " +
        hashedPassword;
      res.send(resultMessage);
    });
  });
});

// Get a list of all users (excluding passwords)
router.get("/users/list", function (req, res, next) {
  const sql = "SELECT username, first_name, last_name, email FROM users";

  db.query(sql, function (err, results) {
    if (err) {
      console.error("Error retrieving user data from the database:", err);
      return res.status(500).send("Error retrieving user data");
    }

    res.render("list.ejs", { users: results });
  });
});

// Export the router object so index.js can access it
module.exports = router;
