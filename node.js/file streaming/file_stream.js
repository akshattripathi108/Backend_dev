const fs = require('fs');
const path = require('path');
const f1 = fs.createReadStream(path.join(__dirname, 'f1.txt'));
const f2 = fs.createWriteStream(path.join(__dirname, 'f2.txt'));

f1.on('data', function (data) {
  console.log('Read chunk:', data.toString());
  const canWrite = f2.write(data);
  if (!canWrite) {
    f1.pause();
  }
});

f2.on('drain', function () {
  f1.resume();
});

f1.on('end', function () {
  f2.end();
  console.log('File copy completed.');
});

function createAndShowLogFile() {
  const logData = 'This is a sample log file.\nIt contains multiple lines of text for testing purposes.\nEnd of log file.';
  fs.writeFileSync(path.join(__dirname, 'log.txt'), logData, 'utf8');
  console.log('log.txt created successfully.');

  const fileContent = fs.readFileSync(path.join(__dirname, 'log.txt'), 'utf8');
  console.log('Content of log.txt:');
  console.log(fileContent);
}

module.exports = {
  createAndShowLogFile
};