1 | const express = require('express');
2 | let books = require("./booksdb.js");
3 | let isValid = require("./auth_users.js").isValid;
4 | let users = require("./auth_users.js").users;
5 | const public_users = express.Router();
6 | 
7 | // Function to check if a user already exists
8 | function doesExist(username) {
9 |     return users.some(user => user.username === username);
10 | }
11 | 
12 | // Register a new user
13 | public_users.post("/register", express.json(), (req, res) => {
14 |     const username = req.body.username;
15 |     const password = req.body.password;
16 | 
17 |     // Check if both username and password are provided
18 |     if (username && password) {
19 |         // Check if the user does not already exist
20 |         if (!doesExist(username)) {
21 |             // Add the new user to the users array
22 |             users.push({ "username": username, "password": password });
23 |             return res.status(200).json({ message: "User successfully registered. Now you can login" });
24 |         } else {
25 |             return res.status(404).json({ message: "User already exists!" });
26 |         }
27 |     }
28 |     // Return error if username or password is missing
29 |     return res.status(404).json({ message: "Unable to register user." });
30 | });
31 | 
32 | // Get the book list available in the shop
33 | public_users.get('/', function (req, res) {
34 |     return res.status(200).json(books); // Respond with the books object directly
35 | });
36 | 
37 | // Get book details based on ISBN
38 | public_users.get('/isbn/:isbn', function (req, res) {
39 |     const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
40 |     const book = books[isbn]; // Find the book by ISBN
41 | 
42 |     if (book) {
43 |         return res.status(200).json(book); // Respond with the book details if found
44 |     } else {
45 |         return res.status(404).json({ message: "Book not found" }); // Respond with an error if not found
46 |     }
47 | }); // Lines 38-46 were added to implement getting book details based on ISBN
48 | 
49 | // Get book details based on author
50 | public_users.get('/author/:author', function (req, res) {
51 |     const author = req.params.author;
52 |     const booksByAuthor = [];
53 | 
54 |     for (let isbn in books) {
55 |         if (books[isbn].author === author) {
56 |             booksByAuthor.push({ isbn, ...books[isbn] });
57 |         }
58 |     }
59 | 
60 |     if (booksByAuthor.length > 0) {
61 |         return res.status(200).json(booksByAuthor);
62 |     } else {
63 |         return res.status(404).json({ message: "No books found by this author" });
64 |     }
65 | });
66 | 
67 | // Get all books based on title
68 | public_users.get('/title/:title', function (req, res) {
69 |     const title = req.params.title;
70 |     const booksByTitle = [];
71 | 
72 |     for (let isbn in books) {
73 |         if (books[isbn].title === title) {
74 |             booksByTitle.push({ isbn, ...books[isbn] });
75 |         }
76 |     }
77 | 
78 |     if (booksByTitle.length > 0) {
79 |         return res.status(200).json(booksByTitle);
80 |     } else {
81 |         return res.status(404).json({ message: "No books found with this title" });
82 |     }
83 | });
84 | 
85 | // Get book review
86 | public_users.get('/review/:isbn', function (req, res) {
87 |     const isbn = req.params.isbn;
88 |     const book = books[isbn];
89 | 
90 |     if (book) {
91 |         return res.status(200).json(book.reviews);
92 |     } else {
93 |         return res.status(404).json({ message: "Book not found" });
94 |     }
95 | });
96 | 
97 | module.exports.general = public_users;