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

const fetchUser = (userDatabase, email) => {
  if (userDatabase[email]) {
    return userDatabase[email]
  } else {
    return {}
  }
}

module.exports = {
  emailExists,
  passwordMatching,
  fetchUser
}

userDatabase = 
  { 'cernvii@gmail.com':
   { username: 'Alexander',
     email: 'cernvii@gmail.com',
     password: 'asd' 
    } 
  }
console.log(emailExists(userDatabase, "cernvii@gmail.com"));
console.log(fetchUser(userDatabase, "cernvii@gmail.com"));
console.log(passwordMatching( userDatabase, "cernvii@gmail.com", "asd"));
