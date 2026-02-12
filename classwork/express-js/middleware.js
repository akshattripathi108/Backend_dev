//middleware is a function that is executed before the route handler is executed. It can be used to perform tasks such as authentication, logging, etc.
//client -> middleware -> route handler -> response.
const express = require('express');
const app = express();

//middleware function to log the request method and url
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); //call the next middleware or route handler
});

app.get('/test', (req, res) => {
    res.send('We are learning about middleware in Express.js');
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});