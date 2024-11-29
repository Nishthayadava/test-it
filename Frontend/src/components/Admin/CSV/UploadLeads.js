import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import axios from 'axios';
import LeadList from './LeadList';
import AssignAgent from './AssignAgent';
function UploadLeads({ token }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select a CSV file to upload');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);  // Make sure this field name matches what multer expects ('file')
    axios
    .post('http://localhost:5000/api/uploadleads', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      alert('Leads uploaded successfully');
    })
    .catch((error) => {
      console.error(error);  // Log the error to inspect what went wrong
      alert('Error uploading leads: ' + (error.response?.data?.message || error.message));
    });
  
  };
  

  return (
    <Box>
      <TextField
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        sx={{ mt: 2 }}
      >
        Upload Leads
      </Button>

      <LeadList/>
      <AssignAgent/>
    </Box>
  );
}

export default UploadLeads;
