const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to check if a user already exists
function doesExist(username) {
    return users.some(user => user.username === username);
}

// Register a new user
public_users.post("/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the user already exists
    if (doesExist(username)) {
        return res.status(400).json({ message: "User already exists!" });
    }

    // Add the new user to the users array
    users.push({ "username": username, "password": password });
    return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        // Simulate an asynchronous operation using Axios
        const response = await axios.get('http://localhost:5001/books'); 
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Mock endpoint for getting books to simulate async operation. 
public_users.get('/books', (req, res) => {
    return res.status(200).json(books);
});

module.exports.general = public_users;