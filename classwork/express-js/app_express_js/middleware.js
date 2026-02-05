// Middleware functions

export const mid1 = (req, res, next) => {
    console.log(`${req.url} method ${req.method}`);
    next();
}

export const validationPost = (req, res, next) => {
    let { name, city } = req.body;

    // Validation
    if (!name || !city) {
        return res.status(400).json({
            message: "name and city field cannot be empty"
        })
    }
    next();
}
