import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9', // Example: light blue
        },
        secondary: {
            main: '#f48fb1', // Example: pink
        },
        background: {
            default: '#121212', // Dark background
            paper: '#1e1e1e',  // Slightly lighter for cards/panels
        },
        text: {
            primary: '#ffffff', // White text
            secondary: '#b0b0b0', // Gray text
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
});

export default darkTheme;
