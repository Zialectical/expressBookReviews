const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// Check if a user with the given username already exists
const doesExist = (username) => {
  return users.some(user => user.username === username);
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
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
    req.session.authorization = { accessToken };
    return res.status(200).json({ message: "User successfully logged in", token: accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.data;

  console.log(`Attempting to add/modify review for ISBN: ${isbn} by user: ${username}`);

  if (!books[isbn]) {
    console.log(`Book with ISBN: ${isbn} not found`);
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;
  console.log(`Review added/modified successfully for ISBN: ${isbn} by user: ${username}`);
  return res.status(200).json({ message: "Review added/modified successfully", reviews: books[isbn].reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.data;

  console.log(`Attempting to delete review for ISBN: ${isbn} by user: ${username}`);

  if (!books[isbn]) {
    console.log(`Book with ISBN: ${isbn} not found`);
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    console.log(`Review deleted successfully for ISBN: ${isbn} by user: ${username}`);
    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
  } else {
    console.log(`Review not found for ISBN: ${isbn} by user: ${username}`);
    return res.status(404).json({ message: "Review not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = doesExist;
module.exports.users = users;