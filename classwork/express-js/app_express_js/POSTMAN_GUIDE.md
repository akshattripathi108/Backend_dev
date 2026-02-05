# Postman Testing Guide - Password Management

## 📮 Quick Setup in Postman

### Create Environment Variables (Optional but Recommended)

1. Click **Environments** → **Create New Environment**
2. Name it: `Registration API`
3. Add variables:
   - `baseUrl`: `http://localhost:3000`
   - `userId`: `1`
   - `resetToken`: (will be populated after forgot-password)

---

## 🧪 Test Cases

### Test Case 1: Register User with Password Validation

**Endpoint:** POST {{baseUrl}}/post

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "username": "alice_smith",
  "email": "alice.smith@example.com",
  "password": "AliceSecure123!",
  "city": "London"
}
```

**Expected Status:** 201 Created

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 6,
    "username": "alice_smith",
    "email": "alice.smith@example.com",
    "city": "London",
    "createdAt": "2026-02-05T..."
  }
}
```

---

### Test Case 2: Register with Invalid Password (No Special Character)

**Endpoint:** POST {{baseUrl}}/post

**Body:**
```json
{
  "username": "bob_jones",
  "email": "bob.jones@example.com",
  "password": "BobPassword123",
  "city": "Manchester"
}
```

**Expected Status:** 400 Bad Request

**Expected Response:**
```json
{
  "success": false,
  "message": "Password must contain at least one special character (@$!%*?&)",
  "requirements": {
    "minLength": 8,
    "mustInclude": [
      "Uppercase (A-Z)",
      "Lowercase (a-z)",
      "Number (0-9)",
      "Special character (!@#$%^&*)"
    ]
  }
}
```

---

### Test Case 3: Change Password - Success

**Endpoint:** PUT {{baseUrl}}/change-password/6

**Body:**
```json
{
  "oldPassword": "AliceSecure123!",
  "newPassword": "NewAlice456@"
}
```

**Expected Status:** 200 OK

**Expected Response:**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "id": 6,
    "username": "alice_smith",
    "email": "alice.smith@example.com",
    "passwordChangedAt": "2026-02-05T..."
  }
}
```

---

### Test Case 4: Change Password - Incorrect Old Password

**Endpoint:** PUT {{baseUrl}}/change-password/6

**Body:**
```json
{
  "oldPassword": "WrongPassword123!",
  "newPassword": "NewAlice456@"
}
```

**Expected Status:** 401 Unauthorized

**Expected Response:**
```json
{
  "success": false,
  "message": "Old password is incorrect"
}
```

---

### Test Case 5: Change Password - Same as Old

**Endpoint:** PUT {{baseUrl}}/change-password/6

**Body:**
```json
{
  "oldPassword": "NewAlice456@",
  "newPassword": "NewAlice456@"
}
```

**Expected Status:** 400 Bad Request

**Expected Response:**
```json
{
  "success": false,
  "message": "New password must be different from old password"
}
```

---

### Test Case 6: Forgot Password

**Endpoint:** POST {{baseUrl}}/forgot-password

**Body:**
```json
{
  "email": "alice.smith@example.com"
}
```

**Expected Status:** 200 OK

**Expected Response:**
```json
{
  "success": true,
  "message": "Password reset link sent to your email",
  "resetToken": "a1b2c3d1707574000",
  "expiresIn": "15 minutes",
  "instructions": "Use this token to reset your password"
}
```

**⚠️ Important:** Copy the `resetToken` value for the next test!

---

### Test Case 7: Reset Password with Token

**Endpoint:** POST {{baseUrl}}/reset-password

**Body:**
```json
{
  "resetToken": "a1b2c3d1707574000",
  "newPassword": "ResetPassword789!"
}
```

**Expected Status:** 200 OK

**Expected Response:**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": {
    "id": 6,
    "username": "alice_smith",
    "email": "alice.smith@example.com",
    "passwordResetAt": "2026-02-05T..."
  }
}
```

---

### Test Case 8: Reset Password - Invalid Token

**Endpoint:** POST {{baseUrl}}/reset-password

**Body:**
```json
{
  "resetToken": "invalid_token_12345",
  "newPassword": "AnotherPass123!"
}
```

**Expected Status:** 400 Bad Request

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

---

### Test Case 9: Forgot Password - Non-existent Email

**Endpoint:** POST {{baseUrl}}/forgot-password

**Body:**
```json
{
  "email": "nonexistent@example.com"
}
```

**Expected Status:** 200 OK (For security, doesn't reveal if email exists)

**Response:**
```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset link has been sent"
}
```

---

## 🔄 Full Test Flow

Follow this sequence to test the entire password management system:

1. **POST /post** → Register new user with valid password
   - Save user ID from response

2. **GET /get/:id** → Verify user registration
   - Confirm user details

3. **PUT /change-password/:id** → Change password
   - Use the user ID from step 1

4. **PUT /change-password/:id** → Try changing with old password
   - Should fail (old password no longer valid)

5. **POST /forgot-password** → Request password reset
   - Save the reset token

6. **POST /reset-password** → Reset password with token
   - Use token from step 5

7. **PUT /change-password/:id** → Change password again
   - Should succeed with newly reset password

---

## 📝 Invalid Password Test Cases

Test each scenario to ensure validation works:

### Missing Uppercase:
```json
{
  "username": "user1",
  "email": "user1@example.com",
  "password": "lowercase123!",
  "city": "Boston"
}
```
**Error:** "Password must contain at least one uppercase letter (A-Z)"

### Missing Lowercase:
```json
{
  "password": "UPPERCASE123!"
}
```
**Error:** "Password must contain at least one lowercase letter (a-z)"

### Missing Number:
```json
{
  "password": "NoNumbers!"
}
```
**Error:** "Password must contain at least one number (0-9)"

### Missing Special Character:
```json
{
  "password": "NoSpecial123"
}
```
**Error:** "Password must contain at least one special character (@$!%*?&)"

### Too Short:
```json
{
  "password": "Short1!"
}
```
**Error:** "Password must be at least 8 characters long"

---

## ✅ Valid Password Examples for Testing

```
MyPass123@       ✓ Valid
SecureKey456#    ✓ Valid
Admin2024!       ✓ Valid
Test$123abc      ✓ Valid
DataBase789%    ✓ Valid
Complex@2026     ✓ Valid
MySecure123!     ✓ Valid
WeakPass1!       ✓ Valid (minimum requirements met)
```

---

## 🛠️ Postman Tips

1. **Save Requests:** Save each request in a Collection for reuse
2. **Tests Tab:** Add tests to validate responses automatically
3. **Pre-request Script:** Use scripts to dynamically set tokens
4. **Environment Variables:** Store base URL and tokens as variables

### Example Pre-request Script to Store Token:
```javascript
// After getting resetToken response, store it
var jsonData = pm.response.json();
pm.environment.set("resetToken", jsonData.resetToken);
```

---

## 🔗 All Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /post | Register new user |
| GET | /get | Get all users |
| GET | /get/:id | Get user by ID |
| PUT | /put/:id | Update user (all fields) |
| PATCH | /patch/:id | Update user (single field) |
| PUT | /change-password/:id | Change password |
| POST | /forgot-password | Request password reset |
| POST | /reset-password | Reset password with token |
| TRACE | /trace | Request trace information |

