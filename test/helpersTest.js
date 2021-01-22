const { assert } = require('chai');

const { generateRandomString, urlforUsers, checkEmails, getUserByEmail } = require('../helpers');

const emailList = {'5fxigd': "cernvii@gmail.com"};

const urlDatabase = {
  "b2xVn2": {longurl: "http://www.lighthouselabs.ca", userID: "5fxigd"},
  "9sm5xK": {longurl: "http://www.google.com", userID: "5fxigd"}
};

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('#getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.strictEqual(user, expectedOutput);
  });
});

describe('#generateRandomString', function() {
  it('should return a string when called', function() {
    const string = generateRandomString();
    assert.ok(string);
  });
});

describe('#urlforUsers', function() {
  it('should return an object of objects containing urls which match the user ID', function() {
    const returnedURLs = urlforUsers("5fxigd", urlDatabase);
    const expectedURLS = urlDatabase;
    assert.deepStrictEqual(returnedURLs, expectedURLS);
  });
});

describe('#checkEmails', function() {
  it('should return true if the email exists in the list', function() {
    assert.strictEqual(checkEmails("cernvii@gmail.com", emailList), true);
  });
});