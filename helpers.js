const bcrypt = require('bcrypt');

const generateRandomString = () => {
  return (Math.random().toString(36).substring(2,8));
};

const urlforUsers = (id, urlDatabase) => {
  let returnedURLs = {};
  for (let short of Object.keys(urlDatabase)) {
    console.log(short);
    if (id === urlDatabase[short]["userID"]) {
      returnedURLs[short] = urlDatabase[short];
    }
  }
  return returnedURLs;
};

const checkEmails = (email, emailList) => {
  for (let key of Object.keys(emailList)) {
    if (emailList[key] === email) {
      return true;
    } else {
      return false;
    }
  }
};

const addNewUser = (userID, email, password, users) => {
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
  for (let id of Object.keys(users)) {
    if (email === users[id]["email"]) {
      return id;
    }
  }
};

module.exports = {
  generateRandomString,
  urlforUsers,
  addNewUser,
  checkEmails,
  getUserByEmail
};

