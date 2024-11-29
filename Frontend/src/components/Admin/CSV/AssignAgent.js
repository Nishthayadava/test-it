import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel, OutlinedInput, Checkbox, ListItemText } from '@mui/material';
import axios from 'axios';

function AssignAgent({ token }) {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [leadIds, setLeadIds] = useState([]); // Supports multiple leads
  const [agentId, setAgentId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch leads and agents
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/getleads', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Filter out rows where `userid` is equal to `'-'`
        const filteredLeadss = response.data.filter((lead) => {
          return String(lead.userid).trim() === '-';
        });
        setLeads(filteredLeadss);

      })
      .catch((error) => {
        console.error('Error fetching leads', error);
      });

    axios
      .get('http://localhost:5000/api/get-users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const agentData = response.data.filter(user => user.role === 'Agent');
        setAgents(agentData);
      })
      .catch((error) => {
        console.error('Error fetching users', error);
      });
  }, [token]);

  const handleAssign = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .post(
          'http://localhost:5000/api/assignagent',
          { leadIds, agentId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          alert('Agent assigned successfully');
        })
        .catch((error) => {
          alert('Error assigning agent: ' + error.response?.data?.message || error.message);
        });
    }
  };

  // Filter leads based on searchTerm
  
  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Assign Agent to Lead(s)
      </Typography>

      {/* Lead Selection (Multiple) */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Lead(s)</InputLabel>
        <Select
          multiple
          value={leadIds}
          onChange={(e) => setLeadIds(e.target.value)}
          input={<OutlinedInput label="Lead(s)" />}
          renderValue={(selected) =>
            selected.map((id) => leads.find((lead) => lead.id === id)?.name).join(', ')
          }
          MenuProps={{
            PaperProps: {
              style: { maxHeight: 300 },
            },
          }}
        >
          {/* Search input within the dropdown */}
          <MenuItem disabled>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </MenuItem>
          {/* Filtered leads list */}
          {filteredLeads.length > 0 ? (
            filteredLeads.map((lead) => (
              <MenuItem key={lead.id} value={lead.id}>
                <Checkbox checked={leadIds.indexOf(lead.id) > -1} />
                <ListItemText primary={lead.name} />
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No leads found</MenuItem>
          )}
        </Select>
      </FormControl>

      {/* Agent Selection */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Agent</InputLabel>
        <Select
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          label="Agent"
        >
          {agents.length > 0 ? (
            agents.map((agent) => (
              <MenuItem key={agent.id} value={agent.id}>
                {agent.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="">No agents available</MenuItem>
          )}
        </Select>
      </FormControl>

      {/* Assign Agent Button */}
      <Button variant="contained" color="primary" onClick={handleAssign}>
        Assign Agent
      </Button>
    </Box>
  );
}

export default AssignAgent;
