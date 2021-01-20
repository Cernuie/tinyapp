const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const generateRandomString = () => {
  return (Math.random().toString(36).substring(2,8));
};

app.post("/login", (req, res) => {
  username = res.cookie("username", req.body.username);
  res.redirect(`/urls`)
})

app.post("/urls", (req, res) => {
  const ID = generateRandomString();
  urlDatabase[ID] = req.body.longURL
  res.redirect(`/urls/${ID}`);
});

app.post("/urls/:id", (req,res) => {
  urlDatabase[req.params.id] = req.body.newURL
  console.log(urlDatabase);
  res.redirect('/urls');
})

app.post("/logout", (req, res) => {
  res.clearCookie('username')
  res.redirect("/urls")
})

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    username: req.cookies.username,
    urls: urlDatabase };
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    username: req.cookies.username,
    urls: urlDatabase 
  }; 
  res.render("urls_index", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) =>{
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
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
    username: req.cookies.username,
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

