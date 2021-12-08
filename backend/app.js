var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const jwt = require("jsonwebtoken");
var app = express();
var router = require("./routes/router");

const jwtMiddleware = (req, res, next) => {
  const token = req.cookies.access_token;

  if (token === undefined || token === null) return next(); // 토큰 없음
  try {
    const decoded = jwt.verify(token, "temp");
    req.user = {
      id: decoded.id,
      name: decoded.name,
    };
    return next();
  } catch (e) {
    // 토큰 검증 실패
    return next();
  }
};

app.use(cookieParser());
app.use(jwtMiddleware);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "../frontend/build")));
app.use("/", router);
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
