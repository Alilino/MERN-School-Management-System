import React, { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import darkTheme from "./themes/darkTheme";
import lightTheme from "./themes/lightTheme";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Homepage from "./pages/Homepage";
import AdminRegisterPage from "./pages/admin/AdminRegisterPage";
import ChooseUser from "./pages/ChooseUser";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import LoginPage from "./pages/LoginPage";
import "./i18n";

const App = () => {
  const { currentRole } = useSelector((state) => state.user);
  const { i18n } = useTranslation();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    console.log("Language changed to:", language);
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
    document.dir = language === "ar" ? "rtl" : "ltr";
  }, [language, i18n.language]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />

      <Router>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          {currentRole === null && (
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/choose" element={<ChooseUser visitor="normal" />} />
              <Route
                path="/chooseasguest"
                element={<ChooseUser visitor="guest" />}
              />
              <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
              <Route
                path="/Studentlogin"
                element={<LoginPage role="Student" />}
              />
              <Route
                path="/Teacherlogin"
                element={<LoginPage role="Teacher" />}
              />
              <Route path="/Adminregister" element={<AdminRegisterPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}

          {currentRole === "Admin" && (
            <AdminDashboard
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              language={language}
              setLanguage={setLanguage}
            />
          )}

          {currentRole === "Student" && <StudentDashboard />}
          {currentRole === "Teacher" && <TeacherDashboard />}
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
