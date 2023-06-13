import React, {useEffect} from 'react';
import './App.css';
import {useNavigate} from "react-router-dom";
import insert from './insert-card.gif';
import {Grid, Typography} from "@mui/material"; // Tell webpack this JS file uses this image

function InsertCard() {
    const navigate = useNavigate();

    useEffect(() => {
            setTimeout(() => navigate("/pin"), 2000);
        }
    );

    return (
        <Grid container direction={"column"} alignItems={"center"} spacing={2}>
            <Grid item>
                <Typography variant={"h5"}>
                    Please insert your card
                </Typography>
            </Grid>
            <Grid item>
                <div className={"icon-container"}>
                    <img className={"insert-card-icon"} src={insert} alt="insertCard"/>
                </div>
            </Grid>
        </Grid>
    );
}

export default InsertCard;
