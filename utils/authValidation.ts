export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
};

export const getAuthErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
        case "auth/invalid-email":
            return "The email address is invalid. Please check and try again.";
        case "auth/user-disabled":
            return "This account has been disabled. Please contact support.";
        case "auth/user-not-found":
            return "No account found with this email. Please sign up.";
        case "auth/wrong-password":
            return "Incorrect password. Please try again.";
        case "auth/email-already-in-use":
            return "An account with this email already exists.";
        case "auth/weak-password":
            return "Password should be at least 6 characters.";
        case "auth/invalid-credential":
            return "Invalid credentials. Please check your email and password.";
        case "auth/operation-not-allowed":
            return "Operation not allowed. Please contact support.";
        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";
        case "auth/missing-password":
            return "Please enter your password.";
        default:
            return "An unexpected error occurred. Please try again.";
    }
};
