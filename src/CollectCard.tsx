import React, {useEffect} from 'react';
import './App.css';
import {useNavigate} from "react-router-dom";
import collectCard from './assets/collect-card.gif';
import {Grid, Typography} from "@mui/material";

function WithdrawSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
            setTimeout(() => navigate("/"), 3000);
        }
    );

    return (
        <Grid container direction={"column"} spacing={2} justifyContent={"center"} alignItems={"center"}>
            <Grid item>
                <Typography variant={"h5"}>Please take your card</Typography>
            </Grid>
            <Grid item>
                <div className={"icon-container"}>
                    <img src={collectCard} className={"rectangular-icon"} alt="collectCard"/>
                </div>
            </Grid>
        </Grid>
    );
}

export default WithdrawSuccess;
