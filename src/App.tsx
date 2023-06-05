import React, {useState} from 'react';
import './App.css';
import {Button, Grid, TextField} from '@mui/material';
import {useNavigate} from "react-router-dom";

function App() {

    const [pin, setPin] = useState<number | null>(null);
    const [balance, setBalance] = useState<number | null>(null);

    const navigate = useNavigate();

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
            return;
        }
        const data = await response.json();
        const currentBalance = data.currentBalance;
        console.log('retrieved balance is: ', currentBalance);
        setBalance(currentBalance);
        // show withdraw page
        navigate("/withdraw", {state: {balance: currentBalance}});
    }

    function handlePinChange(e: any) {
        setPin(e.target.value);
        console.log('pin changed: ', e.target.value);
    }

    return (
        <div className="App">
            <form onSubmit={onPinSubmit}>
                <Grid container>
                    <Grid item xs={12}>
                        <TextField id="outlined-basic" label="Pin" variant="outlined" type={"number"} value={pin}
                                   onChange={handlePinChange}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Button type={"submit"} variant={"outlined"}>Enter pin</Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}

export default App;
