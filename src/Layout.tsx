import React from 'react';
import './App.css';
import {AppBar, Box, Grid, Toolbar} from "@mui/material";
import logo from "./assets/logo.png";

function Layout(props: any) {

    return (
        <div style={{textAlign: "center"}}>
            <AppBar position={"static"}>
                <Toolbar>
                    <img className={"logo"} src={logo}/>
                </Toolbar>
            </AppBar>
            <Box p={5}></Box>
            <Grid container direction={"column"} alignItems={"center"}>
                <Grid item>
                    <Box sx={{
                        backgroundColor: '#F0EEF4',
                        borderRadius: '32px',
                        width: '550px',
                        minHeight: "375px",
                    }}>
                        <Box p={5}>{props.children}</Box>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

export default Layout;
