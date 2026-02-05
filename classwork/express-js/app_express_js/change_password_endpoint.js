// Change Password Endpoint - Update user password
import { userData } from "./data.js";
import { validatePassword } from "./password_validator.js";

export function changePasswordEndpoint(app) {
    app.put("/change-password/:id", (req, res) => {
        try {
            const userId = parseInt(req.params.id);

            if (!req.body) {
                return res.status(400).json({
                    success: false,
                    message: "Request body is required"
                });
            }

            const { oldPassword, newPassword } = req.body;

            // Validation
            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID. Must be a number"
                });
            }

            if (!oldPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Both old password and new password are required"
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

            // Verify old password
            if (userData[userIndex].password !== oldPassword) {
                return res.status(401).json({
                    success: false,
                    message: "Old password is incorrect"
                });
            }

            // Validate new password
            const validation = validatePassword(newPassword);
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: validation.message,
                    requirements: {
                        minLength: 8,
                        mustInclude: ["Uppercase (A-Z)", "Lowercase (a-z)", "Number (0-9)", "Special character (@$!%*?&)"]
                    }
                });
            }

            // Check if new password is same as old password
            if (newPassword === oldPassword) {
                return res.status(400).json({
                    success: false,
                    message: "New password must be different from old password"
                });
            }

            // Update password
            userData[userIndex].password = newPassword;
            userData[userIndex].passwordChangedAt = new Date();

            res.status(200).json({
                success: true,
                message: "Password changed successfully",
                data: {
                    id: userData[userIndex].id,
                    username: userData[userIndex].username,
                    email: userData[userIndex].email,
                    passwordChangedAt: userData[userIndex].passwordChangedAt
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
