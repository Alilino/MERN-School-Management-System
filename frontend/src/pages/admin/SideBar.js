import * as React from "react";
import {
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  FormControl,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import Tooltip from "@mui/material/Tooltip";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from "@mui/icons-material/AnnouncementOutlined";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import ReportIcon from "@mui/icons-material/Report";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { WbSunny, NightsStay } from "@mui/icons-material";
import LanguageSelector from "../../components/LanguageSelector";
import { useTranslation } from "react-i18next";

const SideBar = ({ darkMode, setDarkMode, language, setLanguage }) => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <>
      <React.Fragment>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 10,
            display: "flex",
            alignItems: "center",
            gap: "0px",
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            sx={{
              backgroundColor: "white",
              borderRadius: "50%",
              boxShadow: 2,
              zIndex: 1000,
              border: "1px solid black",
              padding: "8px",
            }}
          >
            {darkMode ? (
              <WbSunny sx={{ fontSize: 25, color: "orange" }} />
            ) : (
              <NightsStay sx={{ fontSize: 25, color: "black" }} />
            )}
          </IconButton>

          <FormControl
            sx={{
              backgroundColor: "transparent",
              zIndex: 1000,
              padding: "8px",
              position: "relative",
            }}
          >
            <LanguageSelector
              darkMode={darkMode}
              language={language}
              setLanguage={setLanguage}
            />
          </FormControl>
        </Box>

        <Tooltip title={t("home")} arrow>
          <ListItemButton component={Link} to="/">
            <ListItemIcon>
              <HomeIcon
                color={location.pathname === "/" ? "primary" : "inherit"}
              />
            </ListItemIcon>
            <ListItemText primary={t("home")} />
          </ListItemButton>
        </Tooltip>
        <Tooltip title={t("classes")} arrow>
          <ListItemButton component={Link} to="/Admin/classes">
            <ListItemIcon>
              <ClassOutlinedIcon
                color={
                  location.pathname.startsWith("/Admin/classes")
                    ? "primary"
                    : "inherit"
                }
              />
            </ListItemIcon>
            <ListItemText primary={t("classes")} />
          </ListItemButton>
        </Tooltip>
        <Tooltip title={t("subjects")} arrow>
          <ListItemButton component={Link} to="/Admin/subjects">
            <ListItemIcon>
              <AssignmentIcon
                color={
                  location.pathname.startsWith("/Admin/subjects")
                    ? "primary"
                    : "inherit"
                }
              />
            </ListItemIcon>
            <ListItemText primary={t("subjects")} />
          </ListItemButton>
        </Tooltip>
        <Tooltip title={t("teachers")} arrow>
          <ListItemButton component={Link} to="/Admin/teachers">
            <ListItemIcon>
              <SupervisorAccountOutlinedIcon
                color={
                  location.pathname.startsWith("/Admin/teachers")
                    ? "primary"
                    : "inherit"
                }
              />
            </ListItemIcon>
            <ListItemText primary={t("teachers")} />
          </ListItemButton>
        </Tooltip>
        <Tooltip title={t("students")} arrow>
          <ListItemButton component={Link} to="/Admin/students">
            <ListItemIcon>
              <PersonOutlineIcon
                color={
                  location.pathname.startsWith("/Admin/students")
                    ? "primary"
                    : "inherit"
                }
              />
            </ListItemIcon>
            <ListItemText primary={t("students")} />
          </ListItemButton>
        </Tooltip>
        <Tooltip title={t("notices")} arrow>
          <ListItemButton component={Link} to="/Admin/notices">
            <ListItemIcon>
              <AnnouncementOutlinedIcon
                color={
                  location.pathname.startsWith("/Admin/notices")
                    ? "primary"
                    : "inherit"
                }
              />
            </ListItemIcon>
            <ListItemText primary={t("notices")} />
          </ListItemButton>
        </Tooltip>
        <Tooltip title={t("complains")} arrow>
          <ListItemButton component={Link} to="/Admin/complains">
            <ListItemIcon>
              <ReportIcon
                color={
                  location.pathname.startsWith("/Admin/complains")
                    ? "primary"
                    : "inherit"
                }
              />
            </ListItemIcon>
            <ListItemText primary={t("complains")} />
          </ListItemButton>
        </Tooltip>
      </React.Fragment>
      <Divider sx={{ my: 1 }} />
      <React.Fragment>
        <ListItemButton component={Link} to="/Admin/profile">
          <ListItemIcon>
            <AccountCircleOutlinedIcon
              color={
                location.pathname.startsWith("/Admin/profile")
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary={t("profile")} />
        </ListItemButton>
        <ListItemButton component={Link} to="/logout">
          <ListItemIcon>
            <ExitToAppIcon
              color={
                location.pathname.startsWith("/logout") ? "primary" : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary={t("logout")} />
        </ListItemButton>
      </React.Fragment>
    </>
  );
};

export default SideBar;
