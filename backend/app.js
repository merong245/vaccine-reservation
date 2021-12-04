var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var register = require("./routes/router");
var login = require("./routes/router");
var remaining_vaccine = require("./routes/router");
var my_vaccine = require("./routes/router");
var visual = require("./routes/visualization");
var app = express();

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

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cookieParser());
app.use(jwtMiddleware);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/register", register);
app.use("/login", login);
app.use("/remaining_vaccine", remaining_vaccine);
app.use("/my_vaccine", my_vaccine);
app.use("/visual", visual);

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
