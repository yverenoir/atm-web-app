import React from 'react';
import './App.css';
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material"; // Tell webpack this JS file uses this image

function ExitButton() {
    const navigate = useNavigate();

    function onEndTransaction() {
        // invalidate auth token
        // redirect user back to pin page
        navigate("/");
    }

    return (
        <Button variant={"contained"} onClick={onEndTransaction}>End transaction</Button>
    );
}

export default ExitButton;
