// PATCH Endpoint - Partial update of user record
import { userData } from "./data.js";

export function patchEndpoint(app) {
    app.patch("/patch/:id", (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const { field, value } = req.body;

            // Validation
            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID. Must be a number"
                });
            }

            if (!field || value === undefined || value === null) {
                return res.status(400).json({
                    success: false,
                    message: "Both 'field' and 'value' are required for PATCH request",
                    example: { field: "username", value: "newname" }
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

            // Allowed fields to update
            const allowedFields = ["username", "email", "city", "password"];
            if (!allowedFields.includes(field)) {
                return res.status(400).json({
                    success: false,
                    message: `Field '${field}' cannot be updated. Allowed fields: ${allowedFields.join(", ")}`
                });
            }

            // Check email uniqueness if updating email
            if (field === "email") {
                const emailExists = userData.some((u, idx) => u.email === value && idx !== userIndex);
                if (emailExists) {
                    return res.status(409).json({
                        success: false,
                        message: "Email already in use by another user"
                    });
                }
            }

            // Perform partial update
            userData[userIndex][field] = value;
            userData[userIndex].updatedAt = new Date();

            res.status(200).json({
                success: true,
                message: `User field '${field}' updated successfully (PATCH - partial update)`,
                data: userData[userIndex]
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
