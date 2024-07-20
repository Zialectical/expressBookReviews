const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // Assuming the token is sent in the Authorization header as "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the header

    if (token == null) return res.sendStatus(401); // If no token, return 401 Unauthorized

    jwt.verify(token, "aVeryVerySecretString", (err, user) => {
        if (err) return res.sendStatus(403); // If token is not valid, return 403 Forbidden
        req.user = user; // If valid, attach user payload to request object
        next(); // Proceed to the next middleware or route handler
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));