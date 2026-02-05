
# Password Management System - Documentation

## 📋 Overview
This registration system includes comprehensive password management features with validation, password changes, and forgot password functionality.

## 🔐 Password Requirements

All passwords must meet the following criteria:
- **Minimum length:** 8 characters
- **Uppercase letters:** At least one (A-Z)
- **Lowercase letters:** At least one (a-z)
- **Numbers:** At least one (0-9)
- **Special characters:** At least one (@$!%*?&)

### Regex Pattern:
```javascript
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
```

### Valid Password Example:
```
MyPass123@
```

### Invalid Password Examples:
- `password` - No uppercase, no numbers, no special chars
- `Pass123` - No special characters
- `Pass@` - Too short, no numbers
- `MYPASS123!` - No lowercase letters

---

## 🚀 API Endpoints

### 1. **POST /post - Register New User**

**URL:** `http://localhost:3000/post`

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "MySecure123!",
  "city": "new york"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 6,
    "username": "john_doe",
    "email": "john@example.com",
    "city": "new york",
    "createdAt": "2026-02-05T10:30:45.123Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Password must contain at least one special character (@$!%*?&)",
  "requirements": {
    "minLength": 8,
    "mustInclude": ["Uppercase (A-Z)", "Lowercase (a-z)", "Number (0-9)", "Special character (@$!%*?&)"]
  }
}
```

---

### 2. **PUT /change-password/:id - Change User Password**

**URL:** `http://localhost:3000/change-password/1`

**Method:** PUT

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "oldPassword": "OldPass123!",
  "newPassword": "NewSecure456@"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "id": 1,
    "username": "amit",
    "email": "amit@example.com",
    "passwordChangedAt": "2026-02-05T10:40:15.789Z"
  }
}
```

**Error Responses:**

*Incorrect old password (401):*
```json
{
  "success": false,
  "message": "Old password is incorrect"
}
```

*Same as old password (400):*
```json
{
  "success": false,
  "message": "New password must be different from old password"
}
```

---

### 3. **POST /forgot-password - Request Password Reset**

**URL:** `http://localhost:3000/forgot-password`

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset link sent to your email",
  "resetToken": "a1b2c3d1707574000",
  "expiresIn": "15 minutes",
  "instructions": "Use this token to reset your password"
}
```

---

### 4. **POST /reset-password - Reset Password with Token**

**URL:** `http://localhost:3000/reset-password`

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "resetToken": "a1b2c3d1707574000",
  "newPassword": "FreshPass789&"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": {
    "id": 1,
    "username": "amit",
    "email": "amit@example.com",
    "passwordResetAt": "2026-02-05T10:50:20.456Z"
  }
}
```

**Error Responses:**

*Invalid or expired token (400):*
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

---

## 📮 Postman Usage Guide

### Testing in Postman

#### 1. Register New User
1. Create a **POST** request
2. URL: `http://localhost:3000/post`
3. Body (JSON):
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "TestPass123!",
  "city": "Delhi"
}
```

#### 2. Change Password
1. Create a **PUT** request
2. URL: `http://localhost:3000/change-password/1`
3. Body (JSON):
```json
{
  "oldPassword": "TestPass123!",
  "newPassword": "UpdatedPass456@"
}
```

#### 3. Forgot Password
1. Create a **POST** request
2. URL: `http://localhost:3000/forgot-password`
3. Body (JSON):
```json
{
  "email": "test@example.com"
}
```
4. Copy the `resetToken` from response

#### 4. Reset Password with Token
1. Create a **POST** request
2. URL: `http://localhost:3000/reset-password`
3. Body (JSON):
```json
{
  "resetToken": "paste_token_here",
  "newPassword": "FinalPass789!"
}
```

---

## 🧪 Testing Checklist

### Password Validation Tests
- [ ] Test with password without uppercase
- [ ] Test with password without lowercase
- [ ] Test with password without numbers
- [ ] Test with password without special characters
- [ ] Test with password less than 8 characters
- [ ] Test with valid password

### Password Change Tests
- [ ] Test with incorrect old password
- [ ] Test with same old and new password
- [ ] Test with new password not meeting requirements
- [ ] Test successful password change

### Forgot Password Tests
- [ ] Test with non-existent email
- [ ] Test with valid email
- [ ] Test token expiration (>15 minutes)
- [ ] Test password reset with expired token
- [ ] Test successful password reset

---

## 🔍 File Structure

```
app_express_js/
├── registration_page.html         # Frontend UI with forms
├── server.js                       # Main server file
├── post_endpoint.js               # User registration endpoint
├── get_endpoint_new.js            # User retrieval endpoints
├── put_endpoint.js                # User update endpoint
├── patch_endpoint.js              # Partial update endpoint
├── change_password_endpoint.js    # Change password endpoint
├── forgot_password_endpoint.js    # Forgot/reset password endpoints
├── password_validator.js          # Password validation utilities
├── middleware.js                  # Middleware functions
├── data.js                        # User data storage
└── package.json                   # Dependencies
```

---

## ⚠️ Important Notes

1. **Password Storage:** In production, always hash passwords using bcrypt or similar libraries. Current implementation stores plain text (for development only).

2. **Email Sending:** The forgot password feature currently returns the token in the response. In production, implement actual email sending using services like SendGrid or Nodemailer.

3. **Token Expiration:** Reset tokens expire after 15 minutes.

4. **Security:** Never expose password hashes or tokens in logs.

---

## 🛠️ Development Setup

```bash
cd classwork/express-js/app_express_js
npm install
node server.js
```

Server will run on `http://localhost:3000`

Access the UI at `http://localhost:3000`

