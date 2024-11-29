import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from './Modal'; // Import your Modal component
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login'; // Import Login icon
import LogoutIcon from '@mui/icons-material/Logout'; // Import Logout icon
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import Stack from '@mui/material/Stack';
import { jwtDecode } from 'jwt-decode'; // Corrected import


const locales = {
    'en-US': require('date-fns/locale/en-US'),
};

const Dashboard = () => {
    const [attendance, setAttendance] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isOnLunchBreak, setIsOnLunchBreak] = useState(false);
    const [isOnBreak, setIsOnBreak] = useState(false);
    const navigate = useNavigate(); // Use the useNavigate hook

    const token = localStorage.getItem('token');
    const userId = token ? jwtDecode(token).id : null; // Decode user ID from token

    const fetchAttendance = async () => {
        if (!userId) return; // Ensure userId is not null
        const response = await axios.get(`http://localhost:5000/api/attendance/${userId}`, {
            headers: { Authorization: token }
        });
        setAttendance(response.data);
    };

    useEffect(() => {
        fetchAttendance();
    }, [userId]);

  
 

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        console.log(event)
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedEvent(null);
    };

    const recordLogin = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                'http://localhost:5000/api/attendance/login',
                { userId },
                { headers: { Authorization: token } }
            );
            if (response.status === 201) {
                await fetchAttendance(); // Re-fetch attendance to update the state
                alert("Successfully recorded login time.");
            } else {
                alert(response.data); // Show the error message from the server
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(
                'http://localhost:5000/api/attendance/logout',
                { userId },
                { headers: { Authorization: token } }
            );
            localStorage.removeItem('token'); // Optionally clear token
            alert("Successfully logged out.");
            await fetchAttendance(); // Re-fetch attendance to update the state
            navigate('/login'); 
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const handleLunchBreak = async () => {
        const token = localStorage.getItem('token');
        const apiEndpoint = `http://localhost:5000/api/attendance/break`;
    
        try {
            const response = await axios.post(apiEndpoint, { userId, breakType: 'lunch' }, { headers: { Authorization: token } });
            setIsOnLunchBreak(prev => !prev); // Toggle state
            await fetchAttendance(); // Re-fetch attendance to update the state
            alert(response.data); // Show the server response
        } catch (error) {
            console.error("Error during lunch break:", error);
        }
    };
    
    const handleBreak = async () => {
        const token = localStorage.getItem('token');
        const apiEndpoint = `http://localhost:5000/api/attendance/break`;
    
        try {
            const response = await axios.post(apiEndpoint, { userId, breakType: 'short' }, { headers: { Authorization: token } });
            setIsOnBreak(prev => !prev); // Toggle state
            await fetchAttendance(); // Re-fetch attendance to update the state
            alert(response.data); // Show the server response
        } catch (error) {
            console.error("Error during break:", error);
        }
    };
    
const Event = ({ event }) => {
 
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '5px', color: 'white' }}>
            <div style={{ flexGrow: 1, fontWeight: 'bold' }}>{event.title}</div>
            {/* {event.break_type && (
                <div style={{
                    ...breakTypeStyle,
                    borderRadius: '3px',
                    marginTop: '2px',
                    padding: '2px',
                    textAlign: 'center',
                }}>
                    {event.break_type}
                </div>
            )} */}
            {event.total_working_time && (
                <div style={{
                    marginTop: '2px',
                    fontWeight: 'bold',
                    textAlign: 'left',
                }}>
                   {(event.total_working_time/60).toFixed(2)}
                </div>
            )}
        </div>
    );
};

    
    const events = attendance.map(entry => {
        let title = 'N/A';
        if (entry.leave_applied === 'N' && entry.status === 'Present' &&  entry.break_type === 'Available') {
            title = 'Available';
        }
           else if (entry.leave_applied === 'N' && entry.status === 'Present' &&  entry.break_type === 'lunch') {
                title = 'Lunch Break';
        }
        else if (entry.leave_applied === 'N' && entry.status === 'Present' &&  entry.break_type === 'short') {
            title = 'Break';
    } else if (entry.leave_applied === 'Y' && entry.status === 'Absent') {
            title = 'Leave';
        }
      
        return {
            title,
            break_type: entry.break_type, // Include break_type here
            start: new Date(entry.date),
            end: new Date(entry.date),
            allDay: true,
            login_time: entry.login_time || 'N/A',
            logout_time: entry.logout_time || 'N/A',
            lunch_break_start: entry.lunch_break_start || 'N/A',
            lunch_break_end: entry.lunch_break_end || 'N/A',
            break_time_start: entry.break_time_start || 'N/A',
            break_time_end: entry.break_time_end || 'N/A',
            total_working_time: entry.total_working_time || '0.0',

            color: entry.break_type === 'Available' ? 'green' : 'red'
            
        };
    });

    return (
        <div>
            <h1>Dashboard</h1>
            <Stack direction="row" spacing={1}>
            <Button color="success" onClick={recordLogin} variant="contained" startIcon={<LoginIcon />}>Login</Button>
            <Button color="secondary" onClick={handleLunchBreak} variant="contained" startIcon={<FastfoodIcon />}>  {isOnLunchBreak ? "End Lunch Break" : "Take Lunch Break"}</Button>
            <Button  onClick={handleBreak} variant="contained" startIcon={<FreeBreakfastIcon />}>   {isOnBreak ? "End Break" : "Take Break"}</Button>
            <Button color="error"  onClick={handleLogout} variant="contained" startIcon={<LogoutIcon />}> Logout</Button>

            </Stack>
       
          
            <Calendar
                localizer={dateFnsLocalizer({
                    format,
                    parse,
                    startOfWeek,
                    getDay,
                    locales,
                })}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: "50px" }}
                eventPropGetter={event => ({
                    style: { backgroundColor: event.color }
                })}
                onSelectEvent={handleSelectEvent}
                views={['month', 'week', 'day']}
                defaultView="month"
                selectable
                components={{
        event: Event // Use the custom event component
    }}
            />
            <Modal isOpen={modalOpen} onClose={closeModal}>
                {selectedEvent && (
                    <table>
                        <tbody>
                            <tr>
                                <th>Title</th>
                                <td>{selectedEvent.title}</td>
                            </tr>
                            <tr>
                                <th>Login Time</th>
                                <td>{selectedEvent.login_time}</td>
                            </tr>
                            <tr>
                                <th>Logout Time</th>
                                <td>{selectedEvent.logout_time}</td>
                            </tr>
                            <tr>
                                <th>Lunch Break Start</th>
                                <td>{selectedEvent.lunch_break_start}</td>
                            </tr>
                            <tr>
                                <th>Lunch Break End</th>
                                <td>{selectedEvent.lunch_break_end}</td>
                            </tr>
                            <tr>
                                <th>Break Start</th>
                                <td>{selectedEvent.break_time_start}</td>
                            </tr>
                            <tr>
                                <th>Break End</th>
                                <td>{selectedEvent.break_time_end}</td>
                            </tr>
                            <tr>
                                <th>Working Hour</th>
                                <td>{selectedEvent.total_working_time}</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </Modal>
        </div>
    );
};






export default Dashboard;
