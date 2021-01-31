const express = require("express");
const bodyParser = require("body-parser");
let cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080;
const { generateRandomString, urlforUsers, addNewUser, checkEmails, getUserByEmail, getEmailByUser } = require('./helpers');
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

/* Initalized 3 databases, a url database, and a user database
*/
const urlDatabase = {
  "b2xVn2": {longurl: "http://www.lighthouselabs.ca", userID: "5fxigd"},
  "9sm5xK": {longurl: "http://www.google.com", userID: "5fxigd"}
};

const users = { 'cernvii@gmail.com':
{ id: '5fxigd',
  email: 'cernvii@gmail.com',
  password:
   '$2b$10$DyMEGUCoU/jahVWWz5VE9uDPl9Hn4PKNvrNXI5kO8OvrV5Gh7Wc9m' }
  
};

//decided to group things by post and get

app.post("/login", (req, res) => {
  const email = req.body.email;
  const pwd = req.body.password;
  //when post to login, we check to see if the email and password fields are correct
  //if it passes every test we initialize a session cookie and redirect them to /urls
  if (email === "" || pwd === "") {
    res.status(403).send("Error 403: Please enter an email/password!");;
  }

  if (getUserByEmail) {
    if (bcrypt.compareSync(pwd, users[email]["password"])) {
      req.session['user_id'] = users[email]["id"];
      res.redirect("/urls");
    } else {
      res.status(403).send("Error 403: Bad password, try again!");;
    }
  } else {
    res.status(403).send("Error 403: Wrong email, try again!");;
  }
});

app.post("/urls", (req, res) => {
  const ID = generateRandomString();
  if (req.session['user_id']) {
    const urlObj = {
      longurl: req.body.longURL,
      userID: req.session["user_id"]
    };
    urlDatabase[ID] = urlObj;
    res.redirect(`/urls/${ID}`);
  } else {
    res.status(401).send("Please log in to do this request");;
  }
});

app.post("/urls/:id", (req,res) => {
  //this is for editing urls
  //checks to see if the session id cookie matches, then changes the longURL.
  if (req.session["user_id"]) {
    //i'm not actually sure why this became params.id
    if (req.session["user_id"] === urlDatabase[req.params.id]["userID"]) {
      urlDatabase[req.params.id].longurl = req.body.newURL;
      res.redirect('/urls');
    } else {
      res.status(400).send("This isn't your URL to edit, please log in to the account to edit it.");;
    }
  } else {
    res.status(400).send("You aren't logged in, please log in to edit this URL");;
  }
});

app.post("/logout", (req, res) => {
  //log out by clearing cookie
  req.session['user_id'] = null;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) =>{
  //this is the delete post,
  //checks to see if the cookies match, then allows the deletion.
  if (req.session["user_id"]) {
    if (req.session["user_id"] === urlDatabase[req.params.shortURL]["userID"]) {
      delete urlDatabase[req.params.shortURL];
      res.redirect('/urls');
    } else {
      res.status(400).send("This isn't your URL to delete, please log in to the account to delete it.");;
    }
  } else {
    res.status(400).send("You aren't logged in, please log in to delete this URL");
  }
});

app.post("/register", (req, res) => {
  //check if email already exists, then if they match
  //if they do we'll make a new user and generate a session cookie
  const pass = req.body.password;
  const email = req.body.email;
  const userID = generateRandomString();
  if (checkEmails(email, users)) {
    res.status(400).send('Error code 400: This email already exists.');
    res.redirect("/register");
  } else if (!(req.body.email) || !(req.body.password)) {
    res.status(400).send('Error code 400, password/email is blank');
  } else {
    const newUser = addNewUser(userID, email, pass, users);
    req.session['user_id'] = newUser;
    res.redirect("/urls");
  }
});

app.get("/", (req, res) => {
  if (!(req.session['user_id'])) {
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/register", (req, res) => {
  res.render("urls_register");
});

app.get("/login", (req, res) => {
  res.render("urls_login");
});

app.get("/urls/new", (req, res) => {
  const urls = urlforUsers(req.session["user_id"], urlDatabase);
  if (req.session["user_id"]) {
    const templateVars = {
      user: req.session["user_id"],
      email: getEmailByUser(req.session["user_id"], users),
      urls: urls,
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  let urls = undefined;
  let email = undefined;
  if (req.session["user_id"]) {
    urls = urlforUsers(req.session["user_id"], urlDatabase);
    email = getEmailByUser(req.session["user_id"], users);
  }
  const templateVars = {
    user: req.session["user_id"],
    email: email,
    urls: urls,
  };
  res.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!(shortURL in urlDatabase)) {
    res.status(404).send('Status code 404, please give a valid ID');
  }
  const longURL = urlDatabase[req.params.shortURL]["longurl"];
  if (longURL === undefined) {
    res.send('404, try again');
  } else {
    res.redirect(longURL);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const urlID = urlDatabase[shortURL]["userID"];
  const ID = req.session["user_id"];
  //check if the urlID and session ID do not match
  if (req.session["user_id"]) {
    if (ID !== urlID) {
      res.status(401).send(`You're not authorized to view this ID!`);
    } else {
      const templateVars =
    {
      user: ID,
      email: getEmailByUser(req.session["user_id"], users),
      shortURL: shortURL,
      longURL: urlDatabase[req.params.shortURL].longurl
    };
      res.render("urls_show", templateVars);
    }
  } else {
    res.status(400).send("Please log in to view this url!");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
