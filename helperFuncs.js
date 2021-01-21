const emailExists = (users, email) => {
  if (users[email]) {
    return true;
  } else {
    return false;
  }
};

const passwordMatching = (users, email, password) => {
  if (users[email].password === password) {
    return true
  } else {
    return false
  }
}

module.exports = {
  emailExists,
  passwordMatching
}
