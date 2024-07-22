const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to check if a user already exists
function doesExist(username) {
    return users.some(user => user.username === username);
}

// Register a new user using Async/Await
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

// Get the book list available in the shop using Async/Await
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5001/books'); // Mock endpoint
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Get book details based on ISBN using Promises
public_users.get('/isbn-promise/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5001/books/${isbn}`) // Mock endpoint
        .then(response => {
            if (response.data) {
                res.status(200).json(response.data);
            } else {
                res.status(404).json({ message: "Book not found" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching book details", error: error.message });
        });
});

// Get book details based on ISBN using Async/Await
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5001/books/${isbn}`); // Mock endpoint
        if (response.data) {
            return res.status(200).json(response.data);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
});

// Mock endpoint for getting book details by ISBN to simulate async operation 
public_users.get('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on Author using Async/Await
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5001/books/author/${author}`); // Mock endpoint
        if (response.data.length > 0) {
            return res.status(200).json(response.data);
        } else {
            return res.status(404).json({ message: "Books by this author not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
});

// Mock endpoint for getting book details by Author to simulate async operation
public_users.get('/books/author/:author', (req, res) => {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "Books by this author not found" });
    }
});

// Get book details based on Title using Promises
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    axios.get(`http://localhost:5001/books/title/${title}`) // Mock endpoint
        .then(response => {
            if (response.data.length > 0) {
                res.status(200).json(response.data);
            } else {
                res.status(404).json({ message: "Books with this title not found" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching book details", error: error.message });
        });
});

// Mock endpoint for getting book details by Title to simulate async operation
public_users.get('/books/title/:title', (req, res) => {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({ message: "Books with this title not found" });
    }
});

module.exports.general = public_users;