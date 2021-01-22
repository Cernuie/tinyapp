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


const addNewUser = (userID, email, password, users) => {
  const salt = bcrypt.genSaltSync(10);
  const newUser = {
    id: userID,
    email,
    password: bcrypt.hashSync(password, salt),
  };
  users[userID] = newUser;
  return userID;
};


module.exports = {
  emailExists,
  generateRandomString,
  urlforUsers,
  addNewUser
};

