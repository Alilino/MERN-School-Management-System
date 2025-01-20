import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#64b5f6' }, // Slightly brighter blue
        secondary: { main: '#ff4081' }, // Brighter pink
        background: {
            default: '#181818', // A lighter dark gray for better readability
            paper: '#282828',   // Contrasting with default background
        },
        text: {
            primary: '#e0e0e0', // Lighter gray for better visibility
            secondary: '#a0a0a0', // Adjust contrast
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
});

export default darkTheme;
