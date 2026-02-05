// Forgot Password Endpoint - Reset password for user
import { userData } from "./data.js";

// Simulated storage for password reset tokens (in production, use database)
let passwordResetTokens = {};

export function forgotPasswordEndpoint(app) {
    app.post("/forgot-password", (req, res) => {
        try {
            if (!req.body) {
                return res.status(400).json({
                    success: false,
                    message: "Request body is required"
                });
            }

            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "Email address is required"
                });
            }

            // Find user by email
            const user = userData.find(u => u.email === email);
            if (!user) {
                // For security, don't reveal if email exists or not
                return res.status(200).json({
                    success: true,
                    message: "If an account exists with this email, a password reset link has been sent"
                });
            }

            // Generate reset token (in production, use crypto)
            const resetToken = Math.random().toString(36).substring(7) + Date.now();
            const expiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

            passwordResetTokens[resetToken] = {
                userId: user.id,
                email: user.email,
                expiresAt: expiryTime
            };

            // In production, send email with reset link
            // For now, return the token in response (development only)
            res.status(200).json({
                success: true,
                message: "Password reset link sent to your email",
                resetToken: resetToken, // Remove in production
                expiresIn: "15 minutes",
                instructions: "Use this token to reset your password"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    });

    // Verify reset token and reset password
    app.post("/reset-password", (req, res) => {
        try {
            if (!req.body) {
                return res.status(400).json({
                    success: false,
                    message: "Request body is required"
                });
            }

            const { resetToken, newPassword } = req.body;

            if (!resetToken || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Reset token and new password are required"
                });
            }

            // Validate token
            if (!passwordResetTokens[resetToken]) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid or expired reset token"
                });
            }

            const tokenData = passwordResetTokens[resetToken];

            // Check if token expired
            if (new Date() > tokenData.expiresAt) {
                delete passwordResetTokens[resetToken];
                return res.status(400).json({
                    success: false,
                    message: "Reset token has expired"
                });
            }

            // Validate new password
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                return res.status(400).json({
                    success: false,
                    message: "Password does not meet requirements",
                    requirements: {
                        minLength: 8,
                        mustInclude: ["Uppercase (A-Z)", "Lowercase (a-z)", "Number (0-9)", "Special character (@$!%*?&)"]
                    }
                });
            }

            // Find and update user
            const userIndex = userData.findIndex(u => u.id === tokenData.userId);
            if (userIndex === -1) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            userData[userIndex].password = newPassword;
            userData[userIndex].passwordResetAt = new Date();

            // Delete used token
            delete passwordResetTokens[resetToken];

            res.status(200).json({
                success: true,
                message: "Password reset successfully",
                data: {
                    id: userData[userIndex].id,
                    username: userData[userIndex].username,
                    email: userData[userIndex].email,
                    passwordResetAt: userData[userIndex].passwordResetAt
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

// Export token storage for testing
export function getResetTokens() {
    return passwordResetTokens;
}

export function clearResetTokens() {
    passwordResetTokens = {};
}
