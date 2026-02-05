// Password validation utilities

// Password requirements regex
// Must contain: Uppercase, Lowercase, Number, Special character (@$!%*?&)
// Minimum 8 characters
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Validate password strength
export function validatePassword(password) {
    if (!password) {
        return {
            isValid: false,
            message: "Password is required"
        };
    }

    if (password.length < 8) {
        return {
            isValid: false,
            message: "Password must be at least 8 characters long"
        };
    }

    if (!/[a-z]/.test(password)) {
        return {
            isValid: false,
            message: "Password must contain at least one lowercase letter (a-z)"
        };
    }

    if (!/[A-Z]/.test(password)) {
        return {
            isValid: false,
            message: "Password must contain at least one uppercase letter (A-Z)"
        };
    }

    if (!/\d/.test(password)) {
        return {
            isValid: false,
            message: "Password must contain at least one number (0-9)"
        };
    }

    if (!/[@$!%*?&]/.test(password)) {
        return {
            isValid: false,
            message: "Password must contain at least one special character (@$!%*?&)"
        };
    }

    return {
        isValid: true,
        message: "Password is valid"
    };
}

// Check password strength level
export function getPasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    if (score <= 2) return "Weak";
    if (score <= 4) return "Medium";
    return "Strong";
}
