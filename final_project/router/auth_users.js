const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  return userswithsamename.length > 0;
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  return validusers.length > 0;
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });
      
      req.session.authorization = {
          accessToken
      };
      return res.status(200).json({ message: "User successfully logged in", token: accessToken });
  } else {
      return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.data;

  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  // Add review to the book
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = doesExist;
module.exports.users = users;