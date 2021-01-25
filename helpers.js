const bcrypt = require('bcrypt');

const generateRandomString = () => {
  //helper that generates a userID by using built-in functions
  return (Math.random().toString(36).substring(2,8));
};

const urlforUsers = (id, urlDatabase) => {
  //helper that finds the urls of a given user by looping through url database
  let returnedURLs = {};
  for (let short of Object.keys(urlDatabase)) {
    if (id === urlDatabase[short]["userID"]) {
      returnedURLs[short] = urlDatabase[short];
    }
  }
  return returnedURLs;
};

const checkEmails = (email, users) => {
  //helper that checks if a given email is already registered by looping through email list object
  for (let key of Object.keys(users)) {
    if (key === email) {
      return true;
    }    
  }
  return false;
};

const addNewUser = (userID, email, password, users) => {
  // helper function that salts a password
  //then puts that newly registered user into the user database
  // returns the userID
  const salt = bcrypt.genSaltSync(10);
  const newUser = {
    id: userID,
    email,
    password: bcrypt.hashSync(password, salt),
  };
  users[email] = newUser;
  return userID;
};

const getUserByEmail = (email, users) => {
  //helper function that gets a userID by a given email
  //this is done by looping through the user database keys.
  for (let id of Object.keys(users)) {
    if (email === users[id]["email"]) {
      return id;
    }
  }
};

const getEmailByUser = (user, users) => {
  //helper function that does the opposite of getUserByEmail.
  //also done by looping through user database keys
  for (let id of Object.keys(users)) {
    if (user === users[id]["id"]) {
      return users[id]["email"];
    }
  }
};

module.exports = {
  generateRandomString,
  urlforUsers,
  addNewUser,
  checkEmails,
  getUserByEmail,
  getEmailByUser
};

