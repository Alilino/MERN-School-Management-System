import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import darkTheme from './themes/darkTheme';
import lightTheme from './themes/lightTheme';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard'; // AdminDashboard import
import Homepage from './pages/Homepage';
import AdminRegisterPage from './pages/admin/AdminRegisterPage';
import ChooseUser from './pages/ChooseUser';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import LoginPage from './pages/LoginPage';

const App = () => {
  const { currentRole } = useSelector(state => state.user);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline /> {/* Resets browser default styles */}

      <Router>  {/* Wrap the whole app in Router */}
        <Box sx={{ display: 'flex' }}>
          {currentRole === null &&
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/choose" element={<ChooseUser visitor="normal" />} />
              <Route path="/chooseasguest" element={<ChooseUser visitor="guest" />} />
              <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
              <Route path="/Studentlogin" element={<LoginPage role="Student" />} />
              <Route path="/Teacherlogin" element={<LoginPage role="Teacher" />} />
              <Route path="/Adminregister" element={<AdminRegisterPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          }

          {currentRole === "Admin" &&
            <AdminDashboard darkMode={darkMode} setDarkMode={setDarkMode} />
          }

          {currentRole === "Student" && <StudentDashboard />}
          {currentRole === "Teacher" && <TeacherDashboard />}
        </Box>
      </Router>  {/* Close Router here */}
    </ThemeProvider>
  );
};

export default App;
