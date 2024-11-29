import React, { useState } from 'react';
import { TextField, Button, Box, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OverallSales = () => {
  const [formData, setFormData] = useState({
    rank: '',
    date_of_joining: '',
    quality_score: '',
    agent: '',
    team_leader: '',
    sales: '',
    achievement: '',
    commitment: ''
  });

  const navigate = useNavigate();

  // Handle form input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format date to dd/mm/yy before submission
    const formattedDate = new Date(formData.date_of_joining).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    const dataToSubmit = { 
      ...formData, 
      date_of_joining: formattedDate 
    };

    try {
      await axios.post('http://localhost:5000/api/insert-sales', dataToSubmit); // Adjust URL to match backend
      alert('Sales data submitted successfully!');
      setFormData({
        rank: '',
        date_of_joining: '',
        quality_score: '',
        agent: '',
        team_leader: '',
        sales: '',
        achievement: '',
        commitment: ''
      });
      navigate('/agentwise-sales');
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to submit data.');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Overall Sales
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Rank" name="rank" value={formData.rank} onChange={handleChange} variant="outlined" required />
          <TextField 
            label="Date of Joining" 
            name="date_of_joining" 
            value={formData.date_of_joining} 
            onChange={handleChange} 
            variant="outlined" 
            type="date" 
            InputLabelProps={{ shrink: true }} 
            required 
          />
          <TextField label="Quality Score" name="quality_score" value={formData.quality_score} onChange={handleChange} variant="outlined" required />
          <TextField label="Agent" name="agent" value={formData.agent} onChange={handleChange} variant="outlined" required />
          <TextField label="Team Leader" name="team_leader" value={formData.team_leader} onChange={handleChange} variant="outlined" required />
          <TextField label="Sales" name="sales" value={formData.sales} onChange={handleChange} variant="outlined" type="number" required />
          <TextField label="Achievement" name="achievement" value={formData.achievement} onChange={handleChange} variant="outlined" required />
          <TextField label="Commitment" name="commitment" value={formData.commitment} onChange={handleChange} variant="outlined" required />
          
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default OverallSales;
