import React from "react";
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Card,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";

// import PeopleIcon from '@mui/icons-material/People';
// import SchoolIcon from '@mui/icons-material/School';
// import BuildIcon from '@mui/icons-material/Build';
// import SettingsIcon from '@mui/icons-material/Settings';

const AdminProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const adminProfilePic = "./";
  //   const totalStudents = 230;
  //   const pendingApprovals = 5;
  //   const newNotifications = 3;
  //   const recentActivities = [
  //     { title: 'Added New Class: Math 101', time: '2 hours ago' },
  //     { title: 'Updated User Profile', time: '4 hours ago' },
  //     { title: 'Reviewed Pending Approvals', time: '6 hours ago' },
  //   ];
  //   const notifications = [
  //     { title: 'New User Registration', message: 'User Sarah Smith has registered.' },
  //     { title: 'Class Approval Needed', message: 'Class Science 202 needs approval.' },
  //     { title: 'System Update Available', message: 'A new system update is available.' },
  //   ];

  //   // Navigation functions
  //   const navigateToUserManagement = () => alert('Navigating to User Management');
  //   const navigateToClassManagement = () => alert('Navigating to Class Management');
  //   const navigateToSystemLogs = () => alert('Navigating to System Logs');
  //   const navigateToSettings = () => alert('Navigating to Settings');

  return (
    <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper
        sx={{
          width: 350,
          padding: 3,
          textAlign: 'center',
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '#f9f9f9',
        }}
      >
        {/* Profile Overview */}
        <Avatar
          src={adminProfilePic} // Replace with actual image URL or import path
          alt={currentUser?.name} // Ensure currentUser exists
          sx={{
            width: 120,
            height: 120,
            marginBottom: 2,
            marginX: 'auto',
            border: '4px solid #1976d2', // Blue border around the avatar
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
          {currentUser?.name}
        </Typography>
        <Typography variant="h6" sx={{ color: 'gray', marginBottom: 0.5 }}>
          {currentUser?.role}
        </Typography>
        <Typography variant="body2" sx={{ color: 'gray', marginBottom: 1 }}>
          {currentUser?.email}
        </Typography>
        <Typography variant="body2" sx={{ color: 'gray', marginBottom: 1 }}>
          {currentUser?.schoolName}
        </Typography>

        <Divider sx={{ marginY: 2 }} /> {/* Horizontal Divider */}
        
        {/* Last Login Time */}
        {/* <Typography variant="body2" sx={{ color: 'gray' }}>
          Last Login: {currentUser?.lastLoginTime}
        </Typography> */}
      </Paper>
    </Box>
  );
};

export default AdminProfile;
