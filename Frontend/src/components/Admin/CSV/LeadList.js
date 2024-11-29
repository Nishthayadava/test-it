import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

function LeadList({ token }) {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    axios
        .get('http://localhost:5000/api/getleads', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
          
          const filteredLeadss = response.data.filter((lead) => {
            return String(lead.userid).trim() === '-';
          });
          

            setLeads(filteredLeadss);     // Make sure `setLeads` is called with the correct data
        })
        .catch((error) => {
            console.error('Error fetching leads', error);
        });
}, [token]);


  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone_number', headerName: 'Phone Number', width: 150 },
    { field: 'address', headerName: 'Address', width: 300 },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Leads List
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={leads}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>
    </Box>
  );
}

export default LeadList;
