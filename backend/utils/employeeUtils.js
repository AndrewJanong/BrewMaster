// Helper function to generate employee ID in the format 'UIXXXXXXX'
const generateEmployeeId = () => {
    const randomNumber = Math.floor(1000000 + Math.random() * 9000000); // Generates a random 8-digit number
    return `UI${randomNumber}`;
}

// Check validity of email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Check validity of gender
const isValidGender = (gender) => {
    return gender === 'Male' || gender === 'Female';
};

// Check validity of phone number
const isValidPhoneNumber = (phone) => {
    return /^[89]\d{7}$/.test(phone);
};


module.exports = { generateEmployeeId, isValidEmail, isValidGender, isValidPhoneNumber };