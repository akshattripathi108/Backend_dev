const os = require('os');
const fs = require('fs');
const path = require('path');

const filePath = path.join(os.homedir(), 'testfile.txt');
const content = 'Hello, this is a test file.\nThis file is created for testing purposes.';

// Write to the file
fs.writeFileSync(filePath, content, 'utf8');
console.log(`File written to ${filePath}`);

// Read from the file
const fileData = fs.readFileSync(filePath, 'utf8');
console.log('File content:');
console.log(fileData);

// Append to the file
const additionalContent = '\nThis line is appended to the file.';
fs.appendFileSync(filePath, additionalContent, 'utf8');
console.log('Additional content appended.');

// Read the updated file
const updatedFileData = fs.readFileSync(filePath, 'utf8');
console.log('Updated file content:');
console.log(updatedFileData);

// Delete the file
fs.unlinkSync(filePath);
console.log(`File ${filePath} deleted.`);