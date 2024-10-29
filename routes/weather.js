const express = require("express");
const router = express.Router();
const request = require("request");

// 使用你的 API Key 替换此处的占位符
const apiKey = "db87a4742183c10d7cd37e445e4f7dea";

router.get("/weather", (req, res) => {
  // 获取用户输入的城市名称，如果没有输入则默认为伦敦
  const city = req.query.city || "london";
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  request(url, (err, response, body) => {
    if (err) {
      // 请求发生错误时显示错误消息
      res.render("weather", { weatherMessage: "Error, please try again" });
    } else {
      const weather = JSON.parse(body);

      // 检查API返回的数据是否有效
      if (weather && weather.main) {
        const weatherMessage = `It is ${weather.main.temp} degrees in ${weather.name}! <br> The humidity now is: ${weather.main.humidity} <br> Wind speed: ${weather.wind.speed} m/s <br> Pressure: ${weather.main.pressure} hPa`;
        res.render("weather", { weatherMessage });
      } else {
        // 如果找不到数据，显示“未找到城市”的消息
        res.render("weather", {
          weatherMessage: "City not found, please try another city.",
        });
      }
    }
  });
});

module.exports = router;

// // 可以，但是没有错误处理
// const express = require("express");
// const router = express.Router();
// const request = require("request");

// // 使用你的 API Key 替换此处的占位符
// const apiKey = "db87a4742183c10d7cd37e445e4f7dea";

// router.get("/weather", (req, res) => {
//   // 获取用户输入的城市名称，如果没有输入则默认为伦敦
//   const city = req.query.city || "london";
//   const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

//   request(url, (err, response, body) => {
//     if (err) {
//       res.render("weather", { weatherMessage: "Error, please try again" });
//     } else {
//       const weather = JSON.parse(body);
//       if (weather.main) {
//         const weatherMessage = `It is ${weather.main.temp} degrees in ${weather.name}! <br> The humidity now is: ${weather.main.humidity}`;
//         res.render("weather", { weatherMessage });
//       } else {
//         res.render("weather", {
//           weatherMessage: "City not found, please try another city.",
//         });
//       }
//     }
//   });
// });

// module.exports = router;

//////////////////

// const express = require("express");
// const router = express.Router();
// const request = require("request");

// // 使用你的 API Key 替换此处的占位符
// const apiKey = "db87a4742183c10d7cd37e445e4f7dea";

// router.get("/weather", (req, res) => {
//   // 如果用户输入了城市名称，使用输入的城市名称，否则默认为伦敦
//   const city = req.query.city || "london";
//   const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

//   request(url, (err, response, body) => {
//     if (err) {
//       res.send("Error, please try again");
//     } else {
//       const weather = JSON.parse(body);
//       if (weather.main) {
//         const wmsg = `It is ${weather.main.temp} degrees in ${weather.name}! <br> The humidity now is: ${weather.main.humidity}`;
//         res.send(wmsg);
//       } else {
//         res.send("City not found, please try another city.");
//       }
//     }
//   });
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const request = require("request");

// // 使用你的 API Key 替换此处的占位符
// const apiKey = "db87a4742183c10d7cd37e445e4f7dea";
// const city = "london";

// router.get("/londonnow", (req, res, next) => {
//   const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

//   request(url, function (err, response, body) {
//     if (err) {
//       next(err);
//     } else {
//       // res.send(body);
//       var weather = JSON.parse(body);
//       var wmsg =
//         "It is " +
//         weather.main.temp +
//         " degrees in " +
//         weather.name +
//         "! <br> The humidity now is: " +
//         weather.main.humidity;
//       res.send(wmsg);
//     }
//   });
// });

// module.exports = router;
