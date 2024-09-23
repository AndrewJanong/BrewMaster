const employeeTestData = {
    validEmployee: {
        name: "Will Smith",
        email_address: "will.smith@example.com",
        phone_number: "93939993",
        gender: "Male",
        cafe: "Yellow Bean"
    },
    beforeUpdateEmployee: {
        name: "Before Update",
        email_address: "before.update@example.com",
        phone_number: "91232357",
        gender: "Male",
        cafe: "Yellow Bean"
    },
    updatedEmployee: {
        name: "Updated",
        email_address: "updated@example.com",
        phone_number: "92342357",
        gender: "Male",
        cafe: "Cafe Blue"
    },
    invalidEmployee: {
        emptyName: {
            name: "",
            email_address: "test@example.com",
            phone_number: "93211234",
            gender: "Male",
            cafe: "Yellow Bean"
        },
        invalidEmail: {
            name: "test",
            email_address: "test",
            phone_number: "93211234",
            gender: "Male",
            cafe: "Yellow Bean"
        },
        invalidPhoneNumber: {
            name: "test",
            email_address: "test@example.com",
            phone_number: "1234",
            gender: "Male",
            cafe: "Yellow Bean"
        },
        existingPhoneNumber: {
            name: "Will",
            email_address: "will@example.com",
            phone_number: "93939993",
            gender: "Male",
            cafe: "Yellow Bean"
        },
        unexistingCafe: {
            name: "test",
            email_address: "test@example.com",
            phone_number: "93902900",
            gender: "Male",
            cafe: "test"
        }
    }
};

module.exports = employeeTestData;