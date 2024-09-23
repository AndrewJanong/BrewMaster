import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from '@tanstack/react-router';

const HomePage: React.FC = () => {
    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            textAlign: 'center',
        }}
        >
            <Typography variant="h4" gutterBottom>
                Welcome to the BrewMaster!
            </Typography>
            <Button variant="contained" size="large" component={Link} to="/cafes">
                Get Started
            </Button>
        </Box>
    );
};

export default HomePage;
