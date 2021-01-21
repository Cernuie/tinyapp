const emailExists = (users, email) => {
  if (users[email]) {
    return true;
  } else {
    return false;
  }
};

const passwordMatching = (users, email, password) => {
  if (users[email].password === password) {
    return true;
  } else {
    return false;
  }
};

const urlDatabase = {
  "b2xVn2": {longurl: "http://www.lighthouselabs.ca", userID: "22t2rqvv"},
  "9sm5xK": {longurl: "http://www.google.com", userID: "22t2rqvv"},
  "9sm5xa": {longurl: "http://www.google.ca", userID: "22t2rqvv"}
};

module.exports = {
  emailExists,
  passwordMatching
};

