// Import required modules
const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const router = express.Router();
const saltRounds = 10;

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("./login"); // redirect to the login
  } else {
    next();
  }
};

//lab 4
const { check, validationResult } = require("express-validator");

// Registration page
router.get("/register", function (req, res, next) {
  res.render("register.ejs", { errors: [] });
});

// Registration handling
router.post(
  "/registered",
  [
    check("email").isEmail().withMessage("Please enter a valid email address"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number")
      .matches(/[@$!%*?&]/)
      .withMessage("Password must contain at least one special character"),
    check("username")
      .isAlphanumeric()
      .withMessage("Username must contain only letters and numbers")
      .notEmpty()
      .withMessage("Username is required"),
    check("first")
      .matches(/^[A-Za-z]+$/)
      .withMessage("First name must contain only letters")
      .notEmpty()
      .withMessage("First name is required"),
    check("last")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Last name must contain only letters")
      .notEmpty()
      .withMessage("Last name is required"),
  ],
  function (req, res, next) {
    //  sanitizer
    req.body.first = req.sanitize(req.body.first);
    req.body.last = req.sanitize(req.body.last);
    req.body.email = req.sanitize(req.body.email);
    req.body.username = req.sanitize(req.body.username);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("register.ejs", { errors: errors.array() });
    } else {
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
          // Use sanitized data for response
          let resultMessage =
            "Hello " +
            userData.firstName +
            " " +
            userData.lastName +
            ", you have successfully registered! We will send an email to " +
            userData.email;
          res.send(resultMessage);
        });
      });
    }
  }
);

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
