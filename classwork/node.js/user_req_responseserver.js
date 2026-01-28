const http = require('http');
const server = http.createServer((req, res) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
    res.end('Welcome to the User Request Response Server!\n');
  } else if (req.url === '/user') {
    res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
    const userData = {
      name: 'John Doe',
      age: 30,
      email: 'john.doe@example.com'
    };
    res.end(JSON.stringify(userData));
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
    res.end('404 Not Found\n');
  }
});
server.listen(3000, () => console.log('Server running on http://localhost:3000'));