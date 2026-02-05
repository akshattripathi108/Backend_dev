// POST Endpoint - Create/Register new user
import { userData } from "./data.js";

export function postEndpoint(app) {
    app.post("/post", (req, res) => {
        try {
            const { username, email, password, city } = req.body;

            // Validation
            if (!username || !email || !password || !city) {
                return res.status(400).json({
                    success: false,
                    message: "All fields (username, email, password, city) are required"
                });
            }
            // Check if user already exists
            const existingUser = userData.find(user => user.email === email);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "User with this email already exists"
                });
            }
            // Create new user
            const newUser = {
                id: userData.length > 0 ? Math.max(...userData.map(u => u.id)) + 1 : 1,
                username,
                email,
                password, // In real app, hash this
                city,
                createdAt: new Date()
            };

            userData.push(newUser);

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                user: newUser
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    });
}
