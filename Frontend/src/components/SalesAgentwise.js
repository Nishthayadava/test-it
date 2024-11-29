import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';

const SalesAgentwise = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/get-sales');
        
        // Sort data by sales in descending order and set rank based on position
        const sortedData = response.data
          .sort((a, b) => b.sales - a.sales) // Sort by sales descending
          .map((item, index) => ({ ...item, rank: index + 1 })); // Assign rank
        
        setSalesData(sortedData);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, []);

  // Conditional style for Quality Score
  const getQualityScoreStyle = (score) => ({
    backgroundColor: score < 80 ? '#ff471a' : '#00e600', // Red for <80, Green for >=80
  });

  // Conditional style for Achievement
  const getAchievementStyle = (achievement) => {
    if (achievement > 80) {
      return { backgroundColor: '#00e600' }; // Green for >80%
    } else if (achievement >= 50 && achievement <= 79) {
      return { backgroundColor: '#ffff4d' }; // Yellow for 50-79%
    } else {
      return { backgroundColor: '#ff471a' }; // Red for <50%
    }
  };

  return (
    <TableContainer component={Paper} sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Sales Agentwise
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Date of Joining</TableCell>
            <TableCell>Quality Score</TableCell>
            <TableCell>Agent</TableCell>
            <TableCell>Team Leader</TableCell>
            <TableCell>Sales</TableCell>
            <TableCell>Achievement</TableCell>
            <TableCell>Commitment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {salesData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.rank}</TableCell>
              <TableCell>{row.date_of_joining}</TableCell>
              
              {/* Quality Score with Conditional Styling */}
              <TableCell style={getQualityScoreStyle(row.quality_score)}>
                {row.quality_score}%
              </TableCell>
              
              <TableCell>{row.agent}</TableCell>
              <TableCell>{row.team_leader}</TableCell>
              <TableCell>{row.sales}</TableCell>
              
              {/* Achievement with Conditional Styling */}
              <TableCell style={getAchievementStyle(row.achievement)}>
                {row.achievement}%
              </TableCell>
              
              <TableCell>{row.commitment}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SalesAgentwise;
