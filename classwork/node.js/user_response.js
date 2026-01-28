const http = require('http')
const url = require('url')

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true)
  const pathname = parsedUrl.pathname
  const method = req.method
  if (method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'text/plain')
    res.end('405 Method Not Allowed')
    return
  }

  if (pathname === '/') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Welcome to the Node.js HTTP server!')
    return
  }

  if (pathname === '/about') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end('<!doctype html><html><head><meta charset="utf-8"><title>About</title></head><body><h1>About</h1><p>This is a simple HTML response.</p></body></html>')
    return
  }

  if (pathname === '/user') {
    const { name, age } = parsedUrl.query
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    const user = { name: name || null, age: age || null }
    res.end(JSON.stringify(user))
    return
  }

  // If none of the above routes matched, return 404
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/plain')
  res.end('404 Page Not Found')
})
server.listen(3000, () => console.log('Server listening on port 3000')