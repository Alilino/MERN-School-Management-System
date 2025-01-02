import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2', // Example: dark blue
        },
        secondary: {
            main: '#dc004e', // Example: pinkish red
        },
        background: {
            default: '#f5f5f5', // Light background
            paper: '#ffffff',  // Pure white for cards/panels
        },
        text: {
            primary: '#000000', // Black text
            secondary: '#616161', // Dark gray text
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
});

export default lightTheme;