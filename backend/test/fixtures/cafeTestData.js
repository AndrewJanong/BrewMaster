const cafeTestData = {
    validCafe: {
        name: 'Valid Cafe',
        description: 'A valid cafe for testing',
        logo: 'https://example.com/logo.png',
        location: 'Test Location'
    },
    beforeUpdateCafe: {
        name: 'Before Updated Cafe',
        description: 'This is the before updated description',
        logo: null,
        location: 'Before Updated Location'
    },
    updatedCafe: {
        name: 'Updated Cafe',
        description: 'This is the updated description',
        logo: null,
        location: 'Updated Location'
    },
    deleteCafe: {
        name: 'Test Delete Cafe',
        description: 'This is a test cafe for deletion',
        logo: null,
        location: 'Delete Test Location'
    },
    invalidCafe: {
        emptyName: {
            name: '',
            description: 'Description',
            logo: null,
            location: 'Location'
        },
        existingName: {
            name: 'Valid Cafe', // Ensure this name exists in your test data
            description: 'Another description',
            logo: null,
            location: 'Another Location'
        }
    }
};

module.exports = cafeTestData;