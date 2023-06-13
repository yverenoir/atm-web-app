import {createTheme} from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#64529A",
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    width: '200px',
                    height: '40px',
                    boxShadow: "none",
                    textTransform: "none",
                    color: "white",
                },
                outlined: {
                    color: '#64529A',
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    backgroundColor: "white",
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: '#27213C',
                }
            }
        },
    }
});