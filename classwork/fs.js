const fs = require('fs');
const path = require('path');
fs.mkdirSync('test_folder/sub1', { recursive: true });
fs.mkdirSync('test_folder/sub2', { recursive: true });
fs.writeFileSync('test_folder/sub1/hello.txt', 'kya haal hai');
console.log('Folder structure created successfully.');  