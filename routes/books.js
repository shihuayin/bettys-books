// Import required modules
const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();

// Middleware to check if the user is logged in
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("../users/login"); // redirect to the login page
  } else {
    next();
  }
};

router.get("/search", function (req, res, next) {
  res.render("search.ejs");
});

router.get("/search_result", function (req, res, next) {
  // Search the database
  let sqlquery =
    "SELECT * FROM books WHERE name LIKE '%" + req.query.search_text + "%'"; // query database to get all the books
  // execute sql query
  db.query(sqlquery, (err, result) => {
    if (err) {
      next(err);
    }
    res.render("list.ejs", { availableBooks: result });
  });
});

router.get("/list", redirectLogin, function (req, res, next) {
  let sqlquery = "SELECT * FROM books"; // query database to get all the books
  // execute sql query
  db.query(sqlquery, (err, result) => {
    if (err) {
      next(err);
    }
    res.render("list.ejs", { availableBooks: result });
  });
});

router.get("/addbook", redirectLogin, function (req, res, next) {
  res.render("addbook.ejs", { errors: [] });
});

router.post(
  "/bookadded",
  [
    check("name").notEmpty().withMessage("Book name is required"),
    check("price").isNumeric().withMessage("Price must be a number"),
  ],
  function (req, res, next) {
    //  sanitizer
    req.body.name = req.sanitize(req.body.name);
    req.body.price = req.sanitize(req.body.price);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("addbook.ejs", { errors: errors.array() });
    } else {
      // saving data in database
      let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
      // execute sql query
      let newrecord = [req.body.name, req.body.price];
      db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
          next(err);
        } else {
          res.send(
            "This book is added to database, name: " +
              req.body.name +
              " price " +
              req.body.price
          );
        }
      });
    }
  }
);

router.get("/bargainbooks", function (req, res, next) {
  let sqlquery = "SELECT * FROM books WHERE price < 20";
  db.query(sqlquery, (err, result) => {
    if (err) {
      next(err);
    }
    res.render("bargains.ejs", { availableBooks: result });
  });
});

// Export the router object so index.js can access it
module.exports = router;
