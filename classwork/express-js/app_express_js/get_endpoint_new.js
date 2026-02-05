// GET Endpoint - Retrieve user(s)
import { userData } from "./data.js";

export function getEndpoint(app) {
    // GET all users
    app.get("/get", (req, res) => {
        try {
            res.status(200).json({
                success: true,
                count: userData.length,
                message: "All users retrieved successfully",
                data: userData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    });

    // GET single user by ID
    app.get("/get/:id", (req, res) => {
        try {
            const userId = parseInt(req.params.id);

            // Validation
            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID. Must be a number"
                });
            }

            const user = userData.find(u => u.id === userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: `User with ID ${userId} not found`
                });
            }

            res.status(200).json({
                success: true,
                message: "User retrieved successfully",
                data: user
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
