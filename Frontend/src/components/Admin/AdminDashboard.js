import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart } from '@mui/x-charts';
import { BarChart } from '@mui/x-charts';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const navigate = useNavigate();

    const fetchAttendanceData = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5000/api/admin/attendance', {
                headers: { Authorization: token }
            });
            setAttendanceData(response.data);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    const columns = [
        { field: 'id', headerName: 'User ID', width: 150 },
        { field: 'name', headerName: 'Username', width: 150 },
        { field: 'role', headerName: 'Role', width: 150 },
        { field: 'date', headerName: 'Date', width: 150 },
        { field: 'login_time', headerName: 'Login Time', width: 150 },
        { field: 'logout_time', headerName: 'Logout Time', width: 150 },
        { field: 'total_working_time', headerName: 'Total Working Time (hrs)', width: 200 },
        { field: 'status', headerName: 'Status', width: 150 },
        { field: 'leave_applied', headerName: 'Leave Applied', width: 150 },
    ];

    return (
        <div>
            <h1>Attendance Dashboard</h1>
            <DataGrid
                rows={attendanceData}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                autoHeight
                getRowId={(row) => row.id}
            />
            <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
                Logout
            </Button>

            {/* Flexbox container for the charts */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', gap: '10px' }}>
                <PieChart
                    series={[
                        {
                            data: [
                                { id: 0, value: 10, label: 'Srushti' },
                                { id: 1, value: 15, label: 'Akash' },
                                { id: 2, value: 20, label: 'Moin' },
                            ],
                        },
                    ]}
                    width={350}  // Reduced width
                    height={250}  // Reduced height
                />

                <BarChart
                    xAxis={[{ scaleType: 'band', data: ['Srushti', 'Akash', 'Moin'] }]}
                    series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
                    width={450}  // Reduced width
                    height={250}  // Reduced height
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
