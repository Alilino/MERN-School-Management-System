// components/LanguageSelector.js
import React, { useState } from "react";
import { Box, MenuItem, IconButton, Popover, List } from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageIcon from "@mui/icons-material/Language";

const LanguageSelector = ({ darkMode, language, setLanguage }) => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const changeLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
    document.dir = selectedLanguage === "ar" ? "rtl" : "ltr";
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1,
    padding: 1,
  }}
>
  <IconButton 
    onClick={handleClick}
    sx={{
      '& svg': {
        fontSize: 30,
        fill: 'url(#languageIconGradient)'
      }
    }}
  >
    <svg width="0" height="0">
      <defs>
        <linearGradient id="languageIconGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          {language === "de" && ( // German flag: Black, Red, Gold
            <>
              <stop offset="0%" stopColor="black" />
              <stop offset="50%" stopColor="#DD0000" />
              <stop offset="100%" stopColor="#FFCE00" />
            </>
          )}
          {language === "en" && ( // American flag: Red, White, Blue
            <>
              <stop offset="0%" stopColor="#B31942" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#0A3161" />
            </>
          )}
          {language === "ar" && ( // Saudi Arabian flag: Green, White, Silver
            <>
              <stop offset="0%" stopColor="#006C35" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#8D8D8D" />
            </>
          )}
          {!["de", "en", "ar"].includes(language) && (
            <>
              <stop offset="0%" stopColor={darkMode ? "white" : "black"} />
              <stop offset="100%" stopColor={darkMode ? "white" : "black"} />
            </>
          )}
        </linearGradient>
      </defs>
    </svg>
    <LanguageIcon />
  </IconButton>

  <Popover
    open={open}
    anchorEl={anchorEl}
    onClose={handleClose}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
  >
    <List>
      <MenuItem onClick={() => changeLanguage("en")}>🇺🇸 English</MenuItem>
      <MenuItem onClick={() => changeLanguage("de")}>🇩🇪 Deutsch</MenuItem>
      <MenuItem onClick={() => changeLanguage("ar")}>🇸🇦 العربية</MenuItem>
    </List>
  </Popover>
</Box>
  );
};

export default LanguageSelector;
