import React from 'react';
import './App.css';
import {useLocation, useNavigate} from "react-router-dom";
import success from './withdrawal-success.gif';
import {Button, Grid} from "@mui/material";
import ExitButton from "./ExitButton"; // Tell webpack this JS file uses this image

function WithdrawSuccess() {
    const navigate = useNavigate();
    const location = useLocation();

    function onWithdrawAgainButtonClicked() {
        const balance = location.state?.balance;
        navigate('/withdraw', {state: {balance: balance}})
    }

    return (
        <Grid container justifyContent={"center"} alignItems={"center"}>
            <Grid item>
                <img src={success} alt="withdrawalSuccess"/>
            </Grid>
            <Grid item>
                <Button onClick={onWithdrawAgainButtonClicked}>Withdraw again</Button>
            </Grid>
            <Grid item>
                <ExitButton/>
            </Grid>
        </Grid>
    );
}

export default WithdrawSuccess;
