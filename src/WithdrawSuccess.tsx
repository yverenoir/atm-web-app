import React from 'react';
import './App.css';
import {useLocation, useNavigate} from "react-router-dom";
import success from './withdrawal-success.gif';
import {Button, Grid, Typography} from "@mui/material";
import ExitButton from "./ExitButton"; // Tell webpack this JS file uses this image

function WithdrawSuccess() {
    const navigate = useNavigate();
    const location = useLocation();

    function onWithdrawAgainButtonClicked() {
        const balance = location.state?.balance;
        navigate('/withdraw', {state: {balance: balance}})
    }

    return (
        <Grid container direction={"column"} spacing={2} justifyContent={"center"} alignItems={"center"}>
            <Grid item>
                <Typography variant={"h5"}>Your cash is ready</Typography>
            </Grid>
            <Grid item>
                <div className={"icon-container"}>
                    <img src={success} className={"rectangular-icon"} alt="withdrawalSuccess"/>
                </div>
            </Grid>
            <Grid item>
                <Button variant={"contained"} onClick={onWithdrawAgainButtonClicked}>Withdraw again</Button>
            </Grid>
            <Grid item>
                <ExitButton/>
            </Grid>
        </Grid>
    );
}

export default WithdrawSuccess;
