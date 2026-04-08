# Session & Cookie-Based Authentication with Express

Complete Node.js Express server with session and cookie-based authentication mechanisms. Includes login, logout, profile retrieval, and session validation.

## Features

✅ Session-based authentication with express-session
✅ HTTP-only, secure cookies (CSRF protection)
✅ User profile management
✅ Session validation and status checking
✅ Automatic session cleanup
✅ Production-ready security practices
✅ Optional data encryption/decryption middleware

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

Server will start on:
- **Local**: `http://localhost:3000`
- **Network**: `http://10.167.245.238:3000`

### 3. Test Credentials

```
Username: alice
Password: password123

Username: bob
Password: securepass
```

## Authentication Flow

### 1. Login (POST /login)

**Request:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "password": "password123"
  }' \
  -c cookies.txt
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "1",
    "username": "alice",
    "email": "alice@example.com"
  }
}
```

> ✅ Session cookie is automatically set in response headers

### 2. Check Session (GET /session-check)

**Request:**
```bash
curl -X GET http://localhost:3000/session-check \
  -b cookies.txt
```

**Response:**
```json
{
  "isActive": true,
  "message": "User has active session",
  "user": {
    "id": "1",
    "username": "alice"
  }
}
```

### 3. Get Profile (GET /profile)

**Request:**
```bash
curl -X GET http://localhost:3000/profile \
  -b cookies.txt
```

**Response:**
```json
{
  "message": "User profile retrieved successfully",
  "profile": {
    "id": "1",
    "username": "alice",
    "email": "alice@example.com",
    "sessionCreated": "2026-04-08T10:30:00.000Z",
    "lastActivity": "2026-04-08T10:35:00.000Z"
  }
}
```

### 4. Check Session Status (GET /session-status)

**Request:**
```bash
curl -X GET http://localhost:3000/session-status \
  -b cookies.txt
```

**Response:**
```json
{
  "isActive": true,
  "sessionId": "abc123def456",
  "userId": "1",
  "username": "alice",
  "createdAt": "2026-04-08T10:30:00.000Z",
  "lastActivity": "2026-04-08T10:35:00.000Z",
  "cookie": {
    "maxAge": 86400000,
    "expires": null
  }
}
```

### 5. Logout (POST /logout)

**Request:**
```bash
curl -X POST http://localhost:3000/logout \
  -b cookies.txt
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

> ✅ Session is destroyed and cookie is invalidated

## Routes Documentation

### Authentication Routes

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| POST | `/login` | Login with credentials | ❌ No |
| GET | `/session-check` | Check if session exists | ✅ Yes |
| GET | `/profile` | Get user profile | ✅ Yes |
| POST | `/logout` | Logout & destroy session | ✅ Yes |
| GET | `/session-status` | Get session details | ❌ No |

### Information Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Server info & available routes |
| GET | `/routes` | List all routes |
| GET | `/secret` | Get encryption secret key |

### Optional Encryption Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/data` | Get encrypted sample data |
| POST | `/decrypt` | Decrypt request payload |
| GET | `/encrypt` | Get encrypted response |
| GET | `/encrypt-always` | Auto-encrypted response |

## Session Configuration

### Default Settings (session.js)

```javascript
{
  secret: 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,              // Set to true for HTTPS in production
    httpOnly: true,             // Prevents JavaScript access
    maxAge: 86400000,           // 24 hours
    sameSite: 'strict'          // CSRF protection
  }
}
```

### Customize Session Secret

```bash
# Set environment variable before starting
export SESSION_SECRET='your-custom-secret-key'
npm start
```

## Cookie Security

### Features

✅ **HTTP-only**: JavaScript cannot access the cookie
✅ **Secure Flag**: Only transmitted over HTTPS (in production)
✅ **SameSite Strict**: CSRF attack prevention
✅ **Path Restriction**: Cookies scoped to `/`
✅ **Max Age**: 24 hours default expiration

### How It Works

1. User logs in → Server creates session
2. Server sends session ID in HTTP-only cookie
3. Browser auto-sends cookie on subsequent requests
4. Server validates cookie and grants access
5. Logout → Server destroys session & clears cookie

## Code Structure

```
middleware/
├── app.js              # Express app & route handlers
├── session.js          # Session middleware & utilities
├── auth.js             # Authentication handlers
├── cookies.js          # Cookie utilities
├── encrypt.js          # Encryption utilities
├── decrypt.js          # Decryption utilities
├── middleware.js       # Encryption middleware
├── package.json        # Dependencies
└── README.md          # This file
```

## File Descriptions

### `session.js`
- Session configuration
- Session middleware setup
- Utility functions for session management
- `sessionMiddleware` - Apply to all routes
- `createSessionData()` - Create user session data
- `getSessionInfo()` - Retrieve session info
- `isSessionValid()` - Check session validity

### `auth.js`
- User authentication logic
- `loginHandler()` - Handle login, create session
- `sessionCheckMiddleware` - Validate session (middleware)
- `getProfileHandler()` - Retrieve user profile
- `logoutHandler()` - Destroy session
- `getSessionStatus()` - Get session metadata

### `cookies.js`
- Cookie helper functions
- `setCookie()` - Set secure cookie
- `getCookie()` - Read cookie value
- `removeCookie()` - Delete cookie
- `setTrackingCookie()` - Set tracking ID

### `app.js`
- Express server setup
- Route handlers
- Error handling
- Server startup

## Testing with Postman/cURL

### Complete Flow

```bash
# 1. Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password123"}' \
  -c cookies.txt

# 2. Check session
curl -X GET http://localhost:3000/session-check -b cookies.txt

# 3. Get profile
curl -X GET http://localhost:3000/profile -b cookies.txt

# 4. Check session status
curl -X GET http://localhost:3000/session-status -b cookies.txt

# 5. Logout
curl -X POST http://localhost:3000/logout -b cookies.txt

# 6. Try session check (should fail - no session)
curl -X GET http://localhost:3000/session-check -b cookies.txt
```

## Error Handling

### 401 Unauthorized
```json
{
  "error": "Unauthorized: No active session"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "path": "/invalid-path",
  "method": "GET"
}
```

### 400 Bad Request
```json
{
  "error": "Invalid username or password",
  "message": "Login failed"
}
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `SESSION_SECRET` - Custom session secret key
- `SECRET_KEY` - Encryption key for data

## Production Deployment

### Before Deploying:

1. **Set secure session secret:**
   ```bash
   export SESSION_SECRET='<random-long-string-128-chars>'
   ```

2. **Enable HTTPS:**
   - Update `session.js` cookie `secure: true`
   - Use proper SSL certificates

3. **Use persistent session store:**
   ```bash
   npm install connect-mongo  # or connect-redis
   ```

4. **Set NODE_ENV:**
   ```bash
   export NODE_ENV=production
   ```

5. **Use environment file:**
   ```bash
   # Create .env file
   SESSION_SECRET=your-secure-key
   NODE_ENV=production
   PORT=3000
   ```

## Troubleshooting

### Session Not Persisting
- Check if cookies are enabled in browser
- Verify HTTP-only cookie is being sent (`-b` flag in curl)
- Check session secret consistency

### Cookie Not Being Set
- Ensure `secure: false` if using HTTP (development)
- Check `httpOnly: true` is set
- Verify `sameSite: 'strict'` configuration

### CORS Issues
- Add `Access-Control-Allow-Credentials: true` header
- Include `credentials: 'include'` in fetch requests

## Security Best Practices

✅ Never store passwords in plain text (use bcrypt)
✅ Use HTTPS in production (secure cookies)
✅ Rotate session secrets regularly
✅ Implement session timeout/activity monitoring
✅ Use strong, random session secrets (>32 chars)
✅ Validate all user inputs
✅ Implement rate limiting on login
✅ Log security events
✅ Use prepared statements for database queries

## References

- [Express Session](https://www.npmjs.com/package/express-session)
- [Cookie Security](https://owasp.org/www-community/controls/Cookie_Security)
- [Session Management](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/README)

## License

MIT
