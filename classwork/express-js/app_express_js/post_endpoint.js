
import { userData } from "./data.js";

export function postEndpoint(app) {
    app.post("/post", (req, res) => {
        try {
            if (!req.body) {
                return res.status(400).json({
                    success: false,
                    message: "Request body is required. Please send JSON data with Content-Type: application/json header"
                });
            }
            
            const { username, email, password, city } = req.body;

            
            if (!username || !email || !password || !city) {
                return res.status(400).json({
                    success: false,
                    message: "All fields (username, email, password, city) are required"
                });
            }
            
            const existingUser = userData.find(user => user.email === email);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "User with this email already exists"
                });
            }
            
            const newUser = {
                id: userData.length > 0 ? Math.max(...userData.map(u => u.id)) + 1 : 1,
                username,
                email,
                password, 
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
