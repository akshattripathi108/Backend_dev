
import { userData } from "./data.js";
import { validatePassword } from "./password_validator.js";

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

            // Validate password strength
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: passwordValidation.message,
                    requirements: {
                        minLength: 8,
                        mustInclude: ["Uppercase (A-Z)", "Lowercase (a-z)", "Number (0-9)", "Special character (@$!%*?&)"]
                    }
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
                createdAt: new Date(),
                passwordChangedAt: new Date()
            };

            userData.push(newUser);

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    city: newUser.city,
                    createdAt: newUser.createdAt
                }
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

