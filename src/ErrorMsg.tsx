import React from 'react';
import './App.css';
import {Typography} from "@mui/material";

function ErrorMsg(props: { msg: string }) {

    return (
        <Typography variant={"body2"}>{props.msg}</Typography>
    );
}

export default ErrorMsg;
