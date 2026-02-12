//serve file from the public directory. relative path is used to specify the location of the file to be served.absolute path can also be used to specify the location of the file to be served.
const express = require('express');
const app = express();
const path = require('path');

//serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});