import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Modal,
  TextField,
  Grid,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
// import { format } from 'date-fns';

function LeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [status, setStatus] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [editLead, setEditLead] = useState(null); // Track the lead being edited

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/my-leads', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeads(response.data.leads);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Failed to fetch leads. Please try again later.');
      }
    };

    fetchLeads();
  }, []);

  // Handle opening modal with the selected lead's data
  const handleEditClick = (lead) => {
    setEditLead(lead);
    setOpenModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditLead(null);
  };

  // Function to handle status change in the dropdown
  const handleStatusChange = (newStatus) => {
    setEditLead((prevLead) => ({
      ...prevLead,
      status: newStatus,
    }));
  };

  // Function to save the status change to the database
  const saveStatusChange = async () => {
    if (!editLead || !editLead.status) {
      setError('Please select a valid status.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        'http://localhost:5000/api/update-lead-status',
        {
          leadId: editLead.id,
          newStatus: editLead.status,
          remark: editLead.remark, // Assuming you will add remark to the lead data
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the leads state with the new status
      const updatedLead = response.data.lead;
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === updatedLead.id ? { ...lead, status: updatedLead.status, remark: updatedLead.remark } : lead
        )
      );

      // Close modal after update
      handleCloseModal();
    } catch (err) {
      setError('Failed to update lead status. Please try again later.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box m={4}>
      <Typography variant="h4" gutterBottom>
        Fresh Leads
      </Typography>
      {leads.length === 0 ? (
        <Alert severity="info">No leads assigned to you.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lead Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Assigned Date</TableCell>
                <TableCell>Updated Date</TableCell>

                <TableCell>Status</TableCell>
                <TableCell>Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone_number}</TableCell>
                  <TableCell>{lead.address}</TableCell>
                  <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
  {lead.updated_at ? new Date(lead.updated_at.replace(' ', 'T').split('.')[0]).toLocaleDateString() : 'No date available'}
</TableCell>


                  <TableCell>{lead.status}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(lead)} // Open modal with lead data
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for editing lead */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit Lead
          </Typography>
          {editLead && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Lead Name"
                  fullWidth
                  value={editLead.name}
                  onChange={(e) => setEditLead({ ...editLead, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  fullWidth
                  value={editLead.email}
                  onChange={(e) => setEditLead({ ...editLead, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone"
                  fullWidth
                  value={editLead.phone_number}
                  onChange={(e) => setEditLead({ ...editLead, phone_number: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  fullWidth
                  value={editLead.address}
                  onChange={(e) => setEditLead({ ...editLead, address: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Remark"
                  fullWidth
                  value={editLead.remark || ''}
                  onChange={(e) => setEditLead({ ...editLead, remark: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editLead.status || ''}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Not_Paid">Not Paid</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                    <MenuItem value="Not Contactable">Not Contactable</MenuItem>
                    <MenuItem value="Closed">Busy tone</MenuItem>
                    <MenuItem value="Closed">Switched Off</MenuItem>
                    <MenuItem value="Ringing">Ringing</MenuItem>
                    <MenuItem value="Closed">Not Reachable</MenuItem>
                    <MenuItem value="Closed">Hung Up</MenuItem>
                    <MenuItem value="Closed">Do Not Disturb</MenuItem>
                    <MenuItem value="Closed">Language Barrier</MenuItem>
                    <MenuItem value="Closed">Non Trader</MenuItem>
                    <MenuItem value="Closed">Live Demo</MenuItem>
                    <MenuItem value="Promise To Pay Online">Promise To Pay Online</MenuItem>
                    <MenuItem value="Call Back With Presentation">Call Back With Presentation</MenuItem>
                    <MenuItem value="Live Demo - Follow Up">Live Demo - Follow Up</MenuItem>
                    <MenuItem value="Call Back Without Presentation">Call Back Without Presentation</MenuItem>
                    <MenuItem value="Closed">Wrong Number</MenuItem>
                    <MenuItem value="Not Interested">Not Interested</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={saveStatusChange} // Save the updated data
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default LeadsDashboard;
