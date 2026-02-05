# 🚀 Quick Start Guide - Password Management System

## 📋 Get Started in 5 Minutes

### Step 1: Start the Server
```bash
cd classwork/express-js/app_express_js
npm install    # If not already installed
node server.js
```

**Expected Output:**
```
Server is running on http://localhost:3000
Available endpoints:
  GET  /              - Registration page
  GET  /get           - Get all users
  GET  /get/:id       - Get user by ID
  POST /post          - Register new user
  PUT  /put/:id       - Update entire user (PUT)
  PATCH /patch/:id    - Partial update (PATCH)
  PUT  /change-password/:id - Change user password
  POST /forgot-password    - Request password reset
  POST /reset-password     - Reset password with token
  TRACE /trace        - Request trace
```

### Step 2: Open the Web Interface
Navigate to: `http://localhost:3000`

You'll see a beautiful registration form with password management features!

---

## 🎯 Common Tasks

### Task 1: Register a New User

**Web UI:**
1. Go to "Register New User" section
2. Fill in details:
   - Username: `john_doe`
   - Email: `john@example.com`
   - Password: `MyPass123!` (Must have uppercase, lowercase, number, special char)
   - City: `New York`
3. Click "Register (POST)"
4. See success message with user ID

**Postman:**
```bash
POST http://localhost:3000/post
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "MyPass123!",
  "city": "New York"
}
```

### Task 2: Change Your Password

**Web UI:**
1. Scroll to "Change Password" section
2. Fill in:
   - User ID: `1` (or your user ID)
   - Old Password: `MyPass123!`
   - New Password: `NewPass456@`
   - Confirm Password: `NewPass456@`
3. Click "Change Password"

**Postman:**
```bash
PUT http://localhost:3000/change-password/1
Content-Type: application/json

{
  "oldPassword": "MyPass123!",
  "newPassword": "NewPass456@"
}
```

### Task 3: Forgot Your Password

**Web UI:**
1. Scroll to "Forgot Password" section
2. Enter your email: `john@example.com`
3. Click "Send Reset Link"
4. Copy the `resetToken` from response (for testing only)

**Postman:**
```bash
POST http://localhost:3000/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### Task 4: Reset Password with Token

**Web UI:**
After getting reset token from forgot-password, you would typically:
1. Click reset link in email (not implemented for web UI)
2. Enter new password

**Postman:**
```bash
POST http://localhost:3000/reset-password
Content-Type: application/json

{
  "resetToken": "a1b2c3d1707574000",
  "newPassword": "FreshPass789&"
}
```

---

## ⚡ Password Requirements

Your password must contain:

✅ **Minimum 8 characters**
```
MyPass123!  ✓ (10 chars)
Short1!     ✗ (7 chars)
```

✅ **At least one UPPERCASE letter**
```
MyPass123!  ✓
mypass123!  ✗
```

✅ **At least one lowercase letter**
```
MyPass123!  ✓
MYPASS123!  ✗
```

✅ **At least one NUMBER**
```
MyPass123!  ✓
MyPassword! ✗
```

✅ **At least one SPECIAL CHARACTER (@$!%*?&)**
```
MyPass123!  ✓
MyPass123   ✗
```

### Password Examples
```
Valid Examples:
- SecureKey456#
- Admin2024!
- Test$123abc
- DataBase789%
- Complex@2026
- MySecure123!
- WeakPass1!

Invalid Examples:
- password123! (no uppercase)
- PASSWORD123! (no lowercase)
- PassWord! (no number)
- MyPassword123 (no special char)
- Pass1! (too short)
```

---

## 🧪 Test Flow (Copy-Paste Ready)

### In Postman:

**1. Register User:**
```json
POST http://localhost:3000/post
Content-Type: application/json

{
  "username": "test_user",
  "email": "test@example.com",
  "password": "TestPass123!",
  "city": "Boston"
}
```

**2. Change Password:**
```json
PUT http://localhost:3000/change-password/6
Content-Type: application/json

{
  "oldPassword": "TestPass123!",
  "newPassword": "UpdatedPass456@"
}
```

**3. Request Password Reset:**
```json
POST http://localhost:3000/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```
⚠️ **Copy the resetToken from response!**

**4. Reset Password:**
```json
POST http://localhost:3000/reset-password
Content-Type: application/json

{
  "resetToken": "PASTE_TOKEN_HERE",
  "newPassword": "FinalPass789!"
}
```

---

## 🔍 Check User Details

**Get All Users:**
```bash
GET http://localhost:3000/get
```

**Get Specific User:**
```bash
GET http://localhost:3000/get/1
```

**Response Example:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "username": "amit",
    "email": "amit@example.com",
    "city": "delhi",
    "password": "SecurePass123!"
  }
}
```

---

## ❌ Common Errors & Solutions

### Error: "Password must contain at least one special character"
**Solution:** Add one of these: `@$!%*?&`
```
Before: MyPass123
After:  MyPass123!  ✓
```

### Error: "Password must contain at least one uppercase letter"
**Solution:** Add uppercase letter (A-Z)
```
Before: mypass123!
After:  MyPass123!  ✓
```

### Error: "Old password is incorrect"
**Solution:** Use the correct current password
```
Make sure you're using the password you set during registration
```

### Error: "Invalid or expired reset token"
**Solution:** Reset tokens expire after 15 minutes
```
Request a new reset token by using /forgot-password again
```

### Error: "Cannot find module 'express'"
**Solution:** Install dependencies
```bash
npm install express
```

---

## 📱 Web UI Sections

The registration page includes these sections:

1. **Register New User (POST)**
   - Create new user account
   - Password validation with strength indicator

2. **Change Password**
   - Update your password
   - Requires old password verification

3. **Forgot Password**
   - Request password reset
   - Email-based recovery

4. **Retrieve User Data (GET)**
   - View individual user details
   - View all users

5. **Update User (PUT)**
   - Update all user fields

6. **Partial Update (PATCH)**
   - Update single field

All sections show real-time server responses!

---

## 🎨 Password Strength Indicator

**Weak** (Red) 🔴
```
- Short passwords
- Missing some requirements
- Strength < 50%
```

**Medium** (Orange) 🟠
```
- Meeting most requirements
- Strength 50-80%
- Could be stronger
```

**Strong** (Green) 🟢
```
- 8+ characters
- All requirements met
- Strength > 80%
```

---

## 🔗 Quick Links

- **Web UI:** `http://localhost:3000`
- **Get All Users:** `http://localhost:3000/get`
- **Full Documentation:** See `PASSWORD_MANAGEMENT_DOCS.md`
- **Postman Guide:** See `POSTMAN_GUIDE.md`

---

## 💡 Pro Tips

1. **Remember Your Password:** Passwords are case-sensitive
2. **Use Special Characters:** Increases security significantly
3. **Change Regularly:** Update password every 90 days
4. **Never Share:** Don't share your password with others
5. **Save Tokens:** When testing forgot-password, copy the reset token
6. **Test Invalid Passwords:** See detailed error messages

---

## 🆘 Need Help?

1. **Check Console:** Server logs show what's happening
2. **Read Errors:** Error messages are detailed and helpful
3. **See Docs:** Read `PASSWORD_MANAGEMENT_DOCS.md`
4. **Try Postman:** Use `POSTMAN_GUIDE.md` for examples

---

**Happy Password Management! 🎉**

