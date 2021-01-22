const bcrypt = require('bcrypt');

const emailExists = (users, email) => {
  if (users[email]) {
    return true;
  } else {
    return false;
  }
};

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

module.exports = {
  emailExists,
  generateRandomString,
  urlforUsers,
};

