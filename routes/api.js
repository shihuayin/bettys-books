const express = require("express");
const router = express.Router();
const request = require("request");

// 本地书籍 API 路由
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

// 朋友的书籍列表 API 路由
router.get("/friends-books", (req, res) => {
  const url = "https://www.doc.gold.ac.uk/usr/108/api/books";

  request(url, (err, response, body) => {
    if (err) {
      res.render("error", { message: "Unable to fetch friend's book list." });
    } else {
      const books = JSON.parse(body);
      res.render("friends-books", { books });
    }
  });
});

module.exports = router;

// const express = require("express");
// const router = express.Router();

// // all books
// router.get("/books", function (req, res, next) {
//   let sqlquery = "SELECT * FROM books";

//   db.query(sqlquery, (err, result) => {
//     if (err) {
//       res.json(err);
//       next(err);
//     } else {
//       res.json(result);
//     }
//   });
// });

// module.exports = router;
