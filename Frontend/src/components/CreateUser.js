// src/components/CreateUser.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    borderRadius: '8px',
    boxShadow: theme.shadows[5],
}));

const CreateUser = () => {
    const [userData, setUserData] = useState({ username: '', password: '', role: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/create-user', userData);
            setMessage(response.data);
        } catch (error) {
            console.error(error);
            setMessage('Error creating user');
        }
    };

    return (
        <StyledContainer>
            <StyledPaper>
                <Typography variant="h4" gutterBottom>
                    Create User
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        type="text"
                        name="username"
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        type="password"
                        name="password"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        required
                    />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Select Role</InputLabel>
                        <Select
                            name="role"
                            value={userData.role}
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>Select Role</em>
                            </MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="Agent">Agent</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Create User
                    </Button>
                </form>
                {message && <Typography variant="body1" color="error" mt={2}>{message}</Typography>}
            </StyledPaper>
        </StyledContainer>
    );
};

export default CreateUser;
