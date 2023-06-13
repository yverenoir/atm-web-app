import React, {useState} from 'react';
import './App.css';
import {Button, Grid, TextField, Typography} from '@mui/material';
import {useNavigate} from "react-router-dom";
import ErrorMsg from "./ErrorMsg";
import {messages} from "./messages";

function Pin() {

    const [pin, setPin] = useState<number | null>(null);
    const [showPinErrorMsg, setShowPinErrorMsg] = useState(false);

    const navigate = useNavigate();
    const nameOfCustomer = "Pompom";

    async function onPinSubmit(e: any) {
        e.preventDefault();
        console.log('pin submitted is');
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({pin: pin})
        };
        console.log('about to send request');
        const response = await fetch('https://frontend-challenge.screencloud-michael.now.sh/api/pin/', requestOptions);
        console.log('response received');
        if (!response.ok) {
            console.log('something went wrong when validating pin');
            setShowPinErrorMsg(true);
            return;
        }
        const data = await response.json();
        const currentBalance = data.currentBalance;
        console.log('retrieved balance is: ', currentBalance);
        // show withdraw page
        navigate("/withdraw", {state: {balance: currentBalance}});
    }

    function handlePinChange(e: any) {
        setPin(e.target.value);
        console.log('pin changed: ', e.target.value);
    }

    return (
        <Grid container direction={"column"} alignItems={"center"} spacing={2}>
            <Grid item>
                <Typography variant={"h5"} p={3}>Hey {nameOfCustomer}, welcome back! </Typography>
                <Typography variant={"h5"}>Please enter your PIN</Typography>
            </Grid>
            <form onSubmit={onPinSubmit}>
                <Grid container direction={"column"} alignItems={"center"} spacing={2}>
                    <Grid item>
                        {showPinErrorMsg && <ErrorMsg msg={messages.wrongPin}/>}
                    </Grid>
                    <Grid item>
                        <TextField id="outlined-basic" label="Pin" variant="outlined" type={"password"} value={pin}
                                   onChange={handlePinChange}
                        />
                    </Grid>
                    <Grid item>
                        <Button type={"submit"} variant={"contained"}>Enter</Button>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    );
}

export default Pin;
