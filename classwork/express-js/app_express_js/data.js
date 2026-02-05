export let userData = [
    {
        id: 1,
        username: "amit",
        email: "amit@example.com",
        password: "SecurePass123!",
        city: "delhi",
        createdAt: new Date("2026-02-01"),
        passwordChangedAt: new Date("2026-02-01")
    },
    {
        id: 2,
        username: "rahul",
        email: "rahul@example.com",
        password: "RahulPass456@",
        city: "assam",
        createdAt: new Date("2026-02-02"),
        passwordChangedAt: new Date("2026-02-02")
    },
    {
        id: 3,
        username: "raj",
        email: "raj@example.com",
        password: "RajSecure789#",
        city: "delhi",
        createdAt: new Date("2026-02-03"),
        passwordChangedAt: new Date("2026-02-03")
    },
    {
        id: 4,
        username: "mohan",
        email: "mohan@example.com",
        password: "MohanPass123$",
        city: "delhi",
        createdAt: new Date("2026-02-04"),
        passwordChangedAt: new Date("2026-02-04")
    },
    {
        id: 5,
        username: "deepak",
        email: "deepak@example.com",
        password: "DeepakKey456%",
        city: "delhi",
        createdAt: new Date("2026-02-05"),
        passwordChangedAt: new Date("2026-02-05")
    }
]

// User Data Structure with Password Management Fields:
// id            - Unique user identifier
// username      - Display name (was "name" before, now "username")
// email         - User email (unique)
// password      - User password (in production, should be hashed with bcrypt)
// city          - User location
// createdAt     - Account creation timestamp
// passwordChangedAt - Last password change timestamp
