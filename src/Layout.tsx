import React from 'react';
import './App.css';
import {AppBar, Toolbar} from "@mui/material";
import logo from "./logo.png";

function Layout(props: any) {

    return (
        <div>
            <AppBar position={"static"}>
                <Toolbar>
                    <img className={"logo"} src={logo}/>
                </Toolbar>
            </AppBar>
            <div>{props.children}</div>
        </div>
    );
}

export default Layout;
