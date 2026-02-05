// PUT Endpoint - Replace entire user record
import { userData } from "./data.js";

export function putEndpoint(app) {
    app.put("/put/:id", (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const { username, email, city } = req.body;

            // Validation
            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID. Must be a number"
                });
            }

            if (!username || !email || !city) {
                return res.status(400).json({
                    success: false,
                    message: "All fields (username, email, city) are required for PUT request"
                });
            }

            // Find user
            const userIndex = userData.findIndex(u => u.id === userId);
            if (userIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: `User with ID ${userId} not found`
                });
            }

            // Check if new email is already used by another user
            const emailExists = userData.some((u, idx) => u.email === email && idx !== userIndex);
            if (emailExists) {
                return res.status(409).json({
                    success: false,
                    message: "Email already in use by another user"
                });
            }

            // Update user (complete replacement)
            const updatedUser = {
                id: userData[userIndex].id,
                username,
                email,
                city,
                password: userData[userIndex].password,
                createdAt: userData[userIndex].createdAt,
                updatedAt: new Date()
            };

            userData[userIndex] = updatedUser;

            res.status(200).json({
                success: true,
                message: "User updated successfully (PUT - complete replacement)",
                data: updatedUser
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
