const bcrypt = require('bcrypt');

const emailExists = (users, email) => {
  if (users[email]) {
    return true;
  } else {
    return false;
  }
};

const passwordMatching = (password, hashedPass) => {
  if (bcrypt.compareSync(password, hashedPass)) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  emailExists,
  passwordMatching
};

