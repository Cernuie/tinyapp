const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;
const { emailExists, passwordMatching } = require('./helperFuncs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { };

const generateRandomString = () => {
  return (Math.random().toString(36).substring(2,8));
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const pwd = req.body.password;
  // if the email coming in from the form is the same as pollo@pockpock.com, then it's a valid user
  if (emailExists(users, email)) {
    if (passwordMatching(users, email, pwd)) {
      const currentUser = {
        email: email,
        password: pwd,
      };
      res.cookie('user_id', currentUser);
      res.redirect("/urls");
    } else {
      res.status(403);
      res.send("Error 403: Bad password, try again!");
      console.log('BAD PASSWORD');
    }
  } else {
    res.status(403);
    res.send("Error 403: Wrong email, try again!");
  }
});

app.post("/urls", (req, res) => {
  const ID = generateRandomString();
  urlDatabase[ID] = req.body.longURL;
  res.redirect(`/urls/${ID}`);
});

app.post("/urls/:id", (req,res) => {
  urlDatabase[req.params.id] = req.body.newURL;
  console.log(urlDatabase);
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) =>{
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  //check if email already exists
  const pass = req.body.password;
  const email = req.body.email;
  if (emailExists(users, email)) {
    res.status(400);
    res.send('Error code 400: This email already exists.');
    res.redirect("/register");
  } else if (req.body.email === '' || req.body.password === '') {
    res.status(400);
    res.send('Error code 400, password/email is blank');
  } else {
    const newUser = {
      email: email,
      password: pass,
    };
    users[email] = newUser;
    res.cookie("user_id", newUser);
    console.log(res.cookie.user_id);
    res.redirect("/urls");
  }
});

app.get("/", (req, res) => {
  res.redirect("urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/register", (req, res) => {
  res.render("urls_register");
});

app.get("/login", (req, res) => {
  console.log(users);
  res.render("urls_login");
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: req.cookies.user_id,
    urls: urlDatabase
  };
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    user: req.cookies.user_id,
    urls: urlDatabase
  };
  console.log(users);
  res.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (longURL === undefined) {
    res.send('404, try again');
  } else {
    res.redirect(longURL);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars =
  {
    user: req.cookies.user_id,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});