import React, { useState ,useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar'; 
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PaidCustomer from './components/PaidCustomer'
import OverallSales from './components/OverallSales';
import SalesAgentwise from './components/SalesAgentwise';
import QualityAndCompliance from './components/QualityAndComplaince';

import AdminDashboard from './components/Admin/AdminDashboard'; // Adjust the path as necessary
import LeadsDashboard from './components/Agent/Lead/LeadsDashboard';
import CreateUser from './components/CreateUser';
import UploadLeads from './components/Admin/CSV/UploadLeads';
import ListItemIcon from '@mui/material/ListItemIcon';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import Diversity3Icon from '@mui/icons-material/Diversity3';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import FollowUp from './components/Agent/Lead/FollowUp';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: open ? 0 : `-${drawerWidth}px`,
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  backgroundColor: '#4d0099',
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

function App() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true); // Default to open
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role')); // Get role from localStorage
  const [loading, setLoading] = useState(true); // Loading state to avoid flickering

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogin = async (userId) => {
    try {
      const response = await axios.post('/api/attendance/login', { userId });

      if (response.status === 201) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('role', response.data.role); // Store role in localStorage
        setIsLoggedIn(true);
        setRole(response.data.role); // Update state with the role
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole(null); // Clear role
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('token'); // Check if token exists
  };

  // Ensure state is updated when component loads
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setRole(localStorage.getItem('role'));
    setLoading(false); // Stop loading after checking auth status

   
    
  }, [isLoggedIn]);


  if (loading) return <div>Loading...</div>; // Avoid flickering until the auth state is resolved


  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                mr: 2,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Welcome To F&O Expert
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#4d0099', // Set background color to blue
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>

          {isLoggedIn && (
            <ListItem sx={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
              <Avatar sx={{ width: 50, height: 50 }}></Avatar> {/* Profile icon */}
            </ListItem>
          )}

            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            

          </DrawerHeader>
          <Divider />
          <List>
            {/* Common Menu Item */}

               {/* Profile Section */}
          
                
        

            {/* Conditional Menu Items based on Role */}
            {role === 'Admin' && (
              <>
                <ListItem button component={Link} to="/admindashboard" sx={{ color: 'white' }}>
                  <ListItemIcon>
                    <DashboardIcon sx={{ color: 'white' }}/>
                  </ListItemIcon>
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>

                <ListItem button component={Link} to="/upload-leads" sx={{ color: 'white' }}>
                  <ListItemIcon>
                    <FolderSpecialIcon sx={{ color: 'white' }}/>
                  </ListItemIcon>
                  <ListItemText primary="Upload Leads" />
                </ListItem>


                <ListItem button component={Link} to="/paidCustomer" sx={{ color: 'white' }}>
                  <ListItemIcon>
                    <PersonAddIcon sx={{ color: 'white' }}/>
                  </ListItemIcon>
                  <ListItemText primary="Paid Customer" />
                </ListItem>


                <ListItem button component={Link} to="/OverallSales" sx={{ color: 'white' }}>
                  <ListItemIcon>
                    <TrendingUpIcon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Overall Sales" />
                </ListItem>

                <ListItem button component={Link} to="/salesAgentwise" sx={{ color: 'white' }}>
                  <ListItemIcon>
                    <Diversity3Icon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Sales Agentwise" />
                </ListItem>

                <ListItem button component={Link} to="/create-user" sx={{ color: 'white' }}>
                  <ListItemIcon>
                    <PersonAddIcon sx={{ color: 'white' }}/>
                  </ListItemIcon>
                  <ListItemText primary="Create User" />
                </ListItem>

                <ListItem button component={Link} to="/qualityAndComplaince" sx={{ color: 'white' }}>
                  <ListItemIcon>
                    <LibraryAddCheckIcon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Quality And Compliance" />
                </ListItem>

              </>
            )}

            {role === 'Agent' && (
              <>
              <ListItem button component={Link} to="/dashboard" sx={{ color: 'white' }}>
              <ListItemIcon>
                <DashboardIcon  sx={{ color: 'white' }}/>
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
                <ListItem button component={Link} to="/leads" sx={{ color: 'white' }}>
                  <ListItemIcon>
                    <AdsClickIcon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Leads" />
                </ListItem>

  
                <ListItem button component={Link} to="/paidCustomer" sx={{ color: 'white' }}>
                  <ListItemIcon>
                    <AccountBoxIcon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText primary="Paid Customer" />
                </ListItem>



                <ListItem button component={Link} to="/followup" sx={{ color: 'white' }}>
                  <ListItemIcon>
                    <ZoomInIcon sx={{ color: 'white' }}/>
                  </ListItemIcon>
                  <ListItemText primary="Follow Up" />
                </ListItem>




                <ListItem button component={Link} to="/salesAgentwise" sx={{ color: 'white' }}>
                  <ListItemIcon>
                    <Diversity3Icon sx={{ color: 'white' }}/>
                  </ListItemIcon>
                  <ListItemText primary="Sales Agentwise" />
                </ListItem>

                <ListItem button component={Link} to="/qualityAndComplaince" sx={{ color: 'white' }}>
                  <ListItemIcon>
                    <LibraryAddCheckIcon  sx={{ color: 'white' }}/>
                  </ListItemIcon>
                  <ListItemText primary="Quality And Compliance" />
                </ListItem>
              
              </>
              
            )}

            {/* Login/Logout */}
            {isLoggedIn ? (
              <ListItem button onClick={handleLogout} component={Link} to="/login" sx={{ color: 'white' }}>
                <ListItemIcon>
                  <LogoutIcon sx={{ color: 'white' }}/>
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            ) : (
              <ListItem button onClick={() => handleLogin('testUserId')} component={Link} to="/login" sx={{ color: 'white' }}>
                <ListItemIcon>
                  <LoginIcon sx={{ color: 'white' }}/>
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
            )}
          </List>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
            />

            <Route
              path="/OverallSales"
              element={isAuthenticated() ? <OverallSales /> : <Navigate to="/login" />}
            />

            <Route
              path="/salesAgentwise"
              element={isAuthenticated() ? <SalesAgentwise /> : <Navigate to="/login" />}
            />

              <Route
                        path="/followup"
                        element={isAuthenticated() ? <FollowUp /> : <Navigate to="/login" />}
                      />

            <Route
              path="/salesAgentwise"
              element={isAuthenticated() ? <QualityAndCompliance /> : <Navigate to="/login" />}
            />


            <Route
              path="/admindashboard"
              element={isAuthenticated() ? <AdminDashboard /> : <Navigate to="/login" />}
            />

            <Route
              path="/create-user"
              element={isAuthenticated()? <CreateUser /> : <Navigate to="/login" />}
            />

            <Route
              path="/upload-leads"
              element={isAuthenticated() ? <UploadLeads /> : <Navigate to="/login" />}
            />

            <Route
              path="/leads"
              element={isAuthenticated() ? <LeadsDashboard /> : <Navigate to="/login" />}
            />


            <Route
              path="/paidCustomer"
              element={isAuthenticated() ? <PaidCustomer /> : <Navigate to="/login" />}
            />

      
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Main>
      </Box>
    </Router>
  );
}

export default App;
