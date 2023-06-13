import {createTheme} from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#33B786",
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    height: '63px',
                    boxShadow: "none",
                    textTransform: "none",
                    color: "white",
                    // fontSize: '21px',
                    // fontWeight: 400,
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                }
            }
        }
    }
});