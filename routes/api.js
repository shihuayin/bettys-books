const express = require("express");
const router = express.Router();

// all books
router.get("/books", function (req, res, next) {
  let sqlquery = "SELECT * FROM books";

  db.query(sqlquery, (err, result) => {
    if (err) {
      res.json(err);
      next(err);
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
