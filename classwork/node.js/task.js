const fs = require('fs');

function createAndShowLogFile() {
  const content = 'This is a log entry created using Node.js fs module.\n';
  fs.writeFileSync('log.txt', content);
  console.log('log.txt created successfully.');
  const fileContent = fs.readFileSync('log.txt', 'utf8');
  console.log('Content of log.txt:');
  console.log(fileContent);
}

function createLargeFile(fileName, sizeInMB) {
  const sizeInBytes = sizeInMB * 1024 * 1024;
  const chunkSize = 1024 * 1024; 
  const buffer = Buffer.alloc(chunkSize, 0); 

  const writeStream = fs.createWriteStream(fileName);

  let written = 0;

  function writeChunk() {
    let canWrite = true;
    while (written < sizeInBytes && canWrite) {
      const remaining = sizeInBytes - written;
      const toWrite = Math.min(chunkSize, remaining);
      canWrite = writeStream.write(buffer.slice(0, toWrite));
      written += toWrite;
    }

    if (written < sizeInBytes) {
      writeStream.once('drain', writeChunk);
    } else {
      writeStream.end();
      console.log(`${fileName} created successfully with size ${sizeInMB} MB.`);
    }
  }

  writeChunk();
}

function readFileWithStream(fileName) {
  const readStream = fs.createReadStream(fileName, {
    highWaterMark: 64 * 1024 // 64 KB chunks
  });

  readStream.on('data', (chunk) => {
    console.log(`Received ${chunk.length} bytes of data.`);
    console.log(chunk.toString());
  });

  readStream.on('end', () => {
    console.log('Finished reading file with stream.');
  });

  readStream.on('error', (err) => {
    console.error('Error reading file:', err);
  });
}

module.exports = {
  createAndShowLogFile,
  createLargeFile,
  readFileWithStream
};

