import React, {useEffect} from 'react';
import './App.css';
import {useNavigate} from "react-router-dom";
import insert from './insert-card.gif';
import {Grid} from "@mui/material"; // Tell webpack this JS file uses this image

function InsertCard() {
    const navigate = useNavigate();

    useEffect(() => {
            setTimeout(() => navigate("/pin"), 1000);
        }
    );

    return (
        <Grid container justifyContent={"center"} alignItems={"center"}>
            <Grid item>
                <img src={insert} alt="insertCard"/>
            </Grid>
        </Grid>
    );
}

export default InsertCard;
