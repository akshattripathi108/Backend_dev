// // //middleware is a function that is executed before the route handler is executed. It can be used to perform tasks such as authentication, logging, etc.
// // //client -> middleware -> route handler -> response.
// // const express = require('express');
// // const app = express();

// // //middleware function to log the request method and url
// // app.use((req, res, next) => {
// //     console.log(`${req.method} ${req.url}`);
// //     next(); //call the next middleware or route handler
// // });

// // app.get('/test', (req, res) => {
// //     res.send('We are learning about middleware in Express.js');
// // });

// // const PORT = 8000;
// // app.listen(PORT, () => {
// //     console.log(`Server is running on port ${PORT}`);
// // });


// //middleware function to check if the user is authenticated
// const express = require('express');
// const app = express();

// const isAuthenticated = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     if (authHeader === 'Bearer mysecrettoken') {
//         next(); //user is authenticated, proceed to the route handler
//     } else {
//         res.status(401).json({ message: 'Unauthorized' }); //user is not authenticated
//     }
// };

// app.get('/protected', isAuthenticated, (req, res) => {
//     res.send('This is a protected route. You are authenticated!');
// });

// const PORT = 8000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


//third party middleware
const express = require('express');
const morgan = require('morgan'); //morgan is a third party middleware for logging HTTP requests
const app = express();

app.use(morgan('dev')); //use morgan middleware in development mode

app.get('/test', (req, res) => {
    res.send('We are learning about third party middleware in Express.js');
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});