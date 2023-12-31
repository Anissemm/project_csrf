const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

// импортируем пакет
const csrf = require("csurf");

const port = 3000;
const app = express();

let reviews = [];

app.set("views", "./templates");
app.set("view engine", "ejs");

// подключаем пакет
app.use(csrf());

app.use(express.static("public"));
app.use(
  session({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
    },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("index", {
    isValidSession: req.session.isValid,
    username: req.session.username,
    reviews,
  });
});

app.post("/reviews", function (req, res) {
  if (req.session.isValid && req.body.newReview)
    reviews.push(req.body.newReview);

  res.render("index", {
    isValidSession: req.session.isValid,
    username: req.session.username,
    reviews,
  });
});

app.get("/session/new", function (req, res) {
  req.session.isValid = true;
  req.session.username = "Anis";
  req.session.email = "Anis@mail.com";
  res.redirect("/");
});

app.get("/user", function (req, res) {
  if (req.session.isValid) {
    res.render("user", {
      username: req.session.username,
      email: req.session.email,
      csrfToken: req.csrfToken(), // генерируем токен
    });
  } else {
    res.redirect("/");
  }
});

app.post("/user", function (req, res) {
  if (req.session.isValid) {
    req.session.username = req.body.username;
    req.session.email = req.body.email;
    res.redirect("/user");
  } else {
    res.redirect("/");
  }
});

app.listen(port, () =>
  console.log(`The server is listening at http://localhost:${port}`)
);
