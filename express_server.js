const express = require("express");
const bodyParser = require("body-parser");
let cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 8080;
const { emailExists, generateRandomString, urlforUsers } = require('./helperFuncs');

app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);

const addNewUser = (userID, email, password) => {
  const salt = bcrypt.genSaltSync(10);
  const newUser = {
    id: userID,
    email,
    password: bcrypt.hashSync(password, salt),
  };
  users[userID] = newUser;
  return userID;
};


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": {longurl: "http://www.lighthouselabs.ca", userID: "5fxigd"},
  "9sm5xK": {longurl: "http://www.google.com", userID: "5fxigd"}
};


const users = { '5fxigd':
{ id: '5fxigd',
  email: 'cernvii@gmail.com',
  password:
   '$2b$10$DyMEGUCoU/jahVWWz5VE9uDPl9Hn4PKNvrNXI5kO8OvrV5Gh7Wc9m' }
  
};



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const pwd = req.body.password;
  if (emailExists(users, email)) {
    if (bcrypt.compareSync(pwd, users[email]["password"])) {
      req.session['user_id'] = users[email]["id"];
      res.redirect("/urls");
    } else {
      res.status(403);
      res.send("Error 403: Bad password, try again!");
    }
  } else {
    res.status(403);
    res.send("Error 403: Wrong email, try again!");
  }
});

app.post("/urls", (req, res) => {
  const ID = generateRandomString();
  const urlObj = {
    longurl: req.body.longURL,
    userID: req.session["user_id"]
  };
  urlDatabase[ID] = urlObj;
  res.redirect(`/urls/${ID}`);
});

app.post("/urls/:id", (req,res) => {
  if (req.session["user_id"]) {
    console.log(req.params.id);
    console.log(urlDatabase);
    //i'm not actually sure why this became params.id
    if (req.session["user_id"] === urlDatabase[req.params.id]["userID"]) {
      urlDatabase[req.params.id].longurl = req.body.newURL;
      res.redirect('/urls');
    } else {
      res.status(400);
      res.send("This isn't your URL to edit, please log in to the account to edit it.");
    }
  } else {
    res.status(400);
    res.send("You aren't logged in, please log in to edit this URL");
  }
});

app.post("/logout", (req, res) => {
  req.session['user_id'] = null;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) =>{
  if (req.session["user_id"]) {
    if (req.session["user_id"] === urlDatabase[req.params.shortURL]["userID"]) {
      delete urlDatabase[req.params.shortURL];
      res.redirect('/urls');
    } else {
      res.status(400);
      res.send("This isn't your URL to delete, please log in to the account to delete it.");
    }
  } else {
    res.status(400);
    res.send("You aren't logged in, please log in to delete this URL");
  }
});

app.post("/register", (req, res) => {
  //check if email already exists, then if they match
  //if they do we'll make a new user and generate a session cookie
  const pass = req.body.password;
  const email = req.body.email;
  const userID = generateRandomString();
  if (emailExists(users, email)) {
    res.status(400);
    res.send('Error code 400: This email already exists.');
    res.redirect("/register");
  } else if (req.body.email === '' || req.body.password === '') {
    res.status(400);
    res.send('Error code 400, password/email is blank');
  } else {
    const newUser = addNewUser(userID, email, pass);
    req.session['user_id'] = newUser;
    console.log(users);
    res.redirect("/urls");
  }
});

app.get("/", (req, res) => {
  res.redirect("/urls");
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
  const urls = urlforUsers(req.session["user_id"], urlDatabase);
  if (req.session["user_id"]) {
    const templateVars = {
      user: req.session["user_id"],
      email: users[req.session["user_id"]]["email"],
      urls: urls,
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  console.log(urlDatabase);
  let urls = undefined;
  console.log(req.session["user_id"]);
  if (req.session["user_id"]) {
    urls = urlforUsers(req.session["user_id"], urlDatabase);
  }
  const templateVars = {
    user: req.session["user_id"],
    email: users[req.session["user_id"]]["email"],
    urls: urls,
  };
  res.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longurl"];
  if (longURL === undefined) {
    res.send('404, try again');
  } else {
    res.redirect(longURL);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars =
  {
    user: req.session["user_id"],
    email: users[req.session["user_id"]]["email"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longurl
  };
  res.render("urls_show", templateVars);
});