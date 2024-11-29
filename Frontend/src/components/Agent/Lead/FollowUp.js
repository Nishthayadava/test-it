import React, { useState, useEffect } from 'react'; 
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Box, Typography, Button, TextField, Modal, Box as MuiBox, IconButton, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

function FollowUp({ token }) {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null); // To store the lead being edited
  const [open, setOpen] = useState(false); // Modal open state
  const [editRemark, setEditRemark] = useState(''); // Remark being edited
  const [editStatus, setEditStatus] = useState(''); // Status being edited
  const [editusers, setEditUsers] = useState(''); // User ID being edited


  useEffect(() => {
    axios
      .get('http://localhost:5000/api/getleads', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const filteredLeads = response.data.filter((lead) => {
          return String(lead.remark).trim() !== 'null' || String(lead.status).trim() !== 'null';
        });
        setLeads(filteredLeads); // Set filtered leads
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
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'status', headerName: 'Status', width: 150, editable: true },
    { field: 'remark', headerName: 'Remark', width: 200, editable: true },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => {
        return (
          <IconButton
            color="primary"
            onClick={() => handleEditClick(params)}npm run build

          >
            <EditIcon />
          </IconButton>
        );
      },
    },
  ];

  // Open the modal with the selected lead details for editing
  const handleEditClick = (params) => {
    setSelectedLead(params.row);
    setEditRemark(params.row.remark);
    setEditStatus(params.row.status);
    setEditUsers(params.row.userid);

    setOpen(true);
  };

  // Handle the change in the remark input field
  const handleRemarkChange = (event) => {
    setEditRemark(event.target.value);
  };

  // Handle the change in the status dropdown
  const handleStatusChange = (event) => {
    setEditStatus(event.target.value);
  };

  // Close the modal without saving changes
  const handleCloseModal = () => {
    setOpen(false);
  };

  // Save the changes and update the backend
  const handleSaveChanges = () => {
    const updatedLead = {
      remark: editRemark,  // the new remark value
      status: editStatus,  // the new status value
      userids: editusers
    };

    const tokens = localStorage.getItem('token');

    axios.put(`http://localhost:5000/api/updatelead/${selectedLead.id}`, updatedLead, {
      headers: {
        Authorization: `Bearer ${tokens}`,
      },
    })
    .then((response) => {
      console.log('Lead updated successfully:', response.data);
      setOpen(false);

      const updatedLeads = leads.map((lead) => {
        if (lead.id === selectedLead.id) {
          return {
            ...lead,
            remark: editRemark,
            status: editStatus,
          };
        }
        return lead;
      });

      setLeads(updatedLeads);
    })
    .catch((error) => {
      console.error('Error updating lead:', error.response?.data || error.message);
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Follow Up
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={leads}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>

      {/* Modal for Editing Lead */}
      <Modal open={open} onClose={handleCloseModal}>
        <MuiBox
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: 400,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit Lead
          </Typography>
          <TextField
            label="Remark"
            fullWidth
            value={editRemark}
            onChange={handleRemarkChange}
            margin="normal"
          />
          {/* Replace Status TextField with Select */}
          <Select
            value={editStatus || ''}
            onChange={handleStatusChange}
            fullWidth
            displayEmpty
            margin="normal"
          >
            {/* <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Not_Paid">Not Paid</MenuItem> */}
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Not Contactable">Not Contactable</MenuItem>
            <MenuItem value="Busy tone">Busy tone</MenuItem>
            <MenuItem value="Switched Off">Switched Off</MenuItem>
            <MenuItem value="Ringing">Ringing</MenuItem>
            <MenuItem value="Not Reachable">Not Reachable</MenuItem>
            <MenuItem value="Hung Up">Hung Up</MenuItem>
            <MenuItem value="DND">Do Not Disturb</MenuItem>
            <MenuItem value="Language Barrier">Language Barrier</MenuItem>
            <MenuItem value="Non Trader">Non Trader</MenuItem>
            <MenuItem value="Live Demo">Live Demo</MenuItem>
            <MenuItem value="Promise To Pay Online">Promise To Pay Online</MenuItem>
            <MenuItem value="Call Back With Presentation">Call Back With Presentation</MenuItem>
            <MenuItem value="Live Demo - Follow Up">Live Demo - Follow Up</MenuItem>
            <MenuItem value="Call Back Without Presentation">Call Back Without Presentation</MenuItem>
            <MenuItem value="Wrong Number">Wrong Number</MenuItem>
            <MenuItem value="Not Interested">Not Interested</MenuItem>
          </Select>

          <Box display="flex" justifyContent="space-between" marginTop={2}>
            <Button onClick={handleCloseModal} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} color="primary" variant="contained">
              Save
            </Button>
          </Box>
        </MuiBox>
      </Modal>
    </Box>
  );
}

export default FollowUp;
