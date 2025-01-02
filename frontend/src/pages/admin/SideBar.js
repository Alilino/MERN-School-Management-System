import * as React from 'react';
import { Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader, IconButton } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import HomeIcon from "@mui/icons-material/Home";
import Tooltip from "@mui/material/Tooltip";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import ReportIcon from '@mui/icons-material/Report';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { WbSunny, NightsStay } from '@mui/icons-material';

const SideBar = ({ darkMode, setDarkMode }) => {
    const location = useLocation();
    return (
        <>
            <React.Fragment>
                <IconButton
                    onClick={() => setDarkMode(!darkMode)}
                    sx={{
                        position: 'fixed',
                        top: 10,
                        left: 10,
                        backgroundColor: 'white',  
                        borderRadius: '50%',
                        boxShadow: 2,
                        zIndex: 1000,
                        border: '1px solid black', 
                        padding: '8px',  
                    }}
                >
                    {darkMode ? (
                        <WbSunny sx={{ fontSize: 25, color: 'orange' }} />
                    ) : (
                        <NightsStay sx={{ fontSize: 25, color: 'black' }} />
                    )}
                </IconButton>
                <Tooltip title="Go to Home" arrow>
                    <ListItemButton component={Link} to="/">
                        <ListItemIcon>
                            <HomeIcon color={location.pathname === ("/" || "/Admin/dashboard") ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </Tooltip>
                <Tooltip title="View Classes" arrow>
                    <ListItemButton component={Link} to="/Admin/classes">
                        <ListItemIcon>
                            <ClassOutlinedIcon color={location.pathname.startsWith('/Admin/classes') ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText primary="Classes" />
                    </ListItemButton>
                </Tooltip>
                <Tooltip title="View Subjects" arrow>
                    <ListItemButton component={Link} to="/Admin/subjects">
                        <ListItemIcon>
                            <AssignmentIcon color={location.pathname.startsWith("/Admin/subjects") ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText primary="Subjects" />
                    </ListItemButton>
                </Tooltip>
                <Tooltip title="View Teachers" arrow>
                    <ListItemButton component={Link} to="/Admin/teachers">
                        <ListItemIcon>
                            <SupervisorAccountOutlinedIcon color={location.pathname.startsWith("/Admin/teachers") ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText primary="Teachers" />
                    </ListItemButton>
                </Tooltip>
                <Tooltip title="View Students" arrow>
                    <ListItemButton component={Link} to="/Admin/students">
                        <ListItemIcon>
                            <PersonOutlineIcon color={location.pathname.startsWith("/Admin/students") ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText primary="Students" />
                    </ListItemButton>
                </Tooltip>
                <Tooltip title="View Notices" arrow>
                    <ListItemButton component={Link} to="/Admin/notices">
                        <ListItemIcon>
                            <AnnouncementOutlinedIcon color={location.pathname.startsWith("/Admin/notices") ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText primary="Notices" />
                    </ListItemButton>
                </Tooltip>
                <Tooltip title="View Complains" arrow>
                    <ListItemButton component={Link} to="/Admin/complains">
                        <ListItemIcon>
                            <ReportIcon color={location.pathname.startsWith("/Admin/complains") ? 'primary' : 'inherit'} />
                        </ListItemIcon>
                        <ListItemText primary="Complains" />
                    </ListItemButton>
                </Tooltip>
            </React.Fragment>
            <Divider sx={{ my: 1 }} />
            <React.Fragment>
                {/* <ListSubheader component="div" inset>
                    User
                </ListSubheader> */}
                <ListItemButton component={Link} to="/Admin/profile">
                    <ListItemIcon>
                        <AccountCircleOutlinedIcon color={location.pathname.startsWith("/Admin/profile") ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </ListItemButton>
                <ListItemButton component={Link} to="/logout">
                    <ListItemIcon>
                        <ExitToAppIcon color={location.pathname.startsWith("/logout") ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </React.Fragment>
        </>
    )
}

export default SideBar
