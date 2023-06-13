import React, {useEffect, useState} from 'react';
import '../App.css';
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Grid, InputAdornment, TextField, Typography} from "@mui/material";
import {getTotal, withdraw as withdrawFromVault} from "../vault/vault";
import ExitButton from "../components/ExitButton";
import ErrorMsg from "../components/ErrorMsg";
import {messages} from "../const/messages";

function Withdrawal() {
    const location = useLocation();
    const navigate = useNavigate();
    const [amount, setAmount] = useState<number | null>(null);

    const balanceFromState = location.state?.balance;

    const [balance, setBalance] = useState<number>(balanceFromState == undefined ? NaN : balanceFromState);
    const [maxAllowedAmount, setMaxAllowedAmount] = useState<number>(0);
    const [showAmountInsufficientMsg, setShowAmountInsufficientMsg] = useState(false);
    const [showOverdraftMsg, setShowOverdraftMsg] = useState(false);
    const [showAmountNotPossibleMsg, setShowAmountNotPossibleMsg] = useState(false);
    const [withdrawUnsuccessfulMsg, setWithdrawUnsuccessfulMsg] = useState(false);
    const [withdrawButtonDisabled, setWithdrawButtonDisabled] = useState(true);

    const allowedOverdraftAmount = 100;

    useEffect(() => {
        setMaxAllowedAmount(balance + allowedOverdraftAmount);
    }, [balance]);

    function handleAmountChange(e: any) {
        const requestedAmount = e.target.value;
        setAmount(requestedAmount);

        // make if else statements into elvis operator statements to set the states
        if (requestedAmount > balance) {
            setShowOverdraftMsg(true);
        } else {
            setShowOverdraftMsg(false);
        }

        if (requestedAmount > maxAllowedAmount) {
            setShowAmountInsufficientMsg(true);
            setWithdrawButtonDisabled(true);
        } else {
            setShowAmountInsufficientMsg(false);
            setWithdrawButtonDisabled(false);
        }

        // check against actual cash in vault and change value for mod
        if (requestedAmount % 5 !== 0) {
            setShowAmountNotPossibleMsg(true);
            setWithdrawButtonDisabled(true);
        } else {
            setShowAmountNotPossibleMsg(false);
            setWithdrawButtonDisabled(false);
        }

        // display message if amount is bigger than allowed amount
        // disable withdraw button if amount is bigger than allowed
        // disable withdraw button if ATM not able to dispense (mod 5)
    }

    function onWithdrawSubmit(e: any) {
        e.preventDefault();

        console.log('withdrawing amount: ', amount);
        if (amount == null) {
            throw new Error("Amount invalid");
        }

        const totalInVault = getTotal();
        const withdrawalIsAllowed = totalInVault >= amount;
        // display message if user is overdrawing
        if (withdrawalIsAllowed) {
            // substract withdrawn amount from balance
            const withdrawSuccess = withdraw(amount);
            if (!withdrawSuccess) {
                setWithdrawUnsuccessfulMsg(true);
                return;
            }

            setBalance(balance - amount);
            navigate("/withdrawal-success", {state: {balance: balance - amount}});
        } else {
            // show vault cash insufficient msg, or show this message even in handleAmountChange()?
        }
    }

    // This does not consider the physical limit of max. number of notes can be dispensed at the ATM
    // Few ways to optimise against:
    // a) minimum number of notes
    // b) evenly distribution of all denominations
    // c) even withdraw from different denominations to leave the casettes in the most balanced distribution
    // ...
    // z) a combination of all/few of the above with different weights
    function withdraw(amount: number): boolean {
        console.log('withdrawing');
        return withdrawFromVault(amount);
    }

    // check for auth status, only show this page when user is logged in
    return (
        <Grid container direction={"column"} alignItems={"center"} spacing={2}>
            <Grid item>
                <Typography variant={"h5"}>
                    Balance: £{balance}
                </Typography>
            </Grid>
            <Grid item>
                <Grid container direction={"column"} spacing={1}>
                    <Grid item>{showAmountNotPossibleMsg && <ErrorMsg msg={messages.illegalAmount}/>}</Grid>
                    <Grid item>{showOverdraftMsg && <ErrorMsg msg={messages.overdraft}/>}</Grid>
                    <Grid item>{showAmountInsufficientMsg && <ErrorMsg msg={messages.amountInsufficient}/>}</Grid>
                    <Grid item>{withdrawUnsuccessfulMsg && <ErrorMsg msg={messages.withdrawUnsuccessful}/>}</Grid>
                </Grid>
            </Grid>
            <Grid item>
                <form onSubmit={onWithdrawSubmit}>
                    <Grid container direction={"column"} alignItems={"center"} spacing={2}>
                        <Grid item>
                            <TextField label="Amount" variant="outlined" type={"number"} value={amount}
                                       onChange={handleAmountChange}
                                       InputProps={{
                                           startAdornment: <InputAdornment position="start">£</InputAdornment>,
                                       }}/>
                        </Grid>
                        <Grid item>
                            <Button type={"submit"} variant={"contained"}
                                    disabled={withdrawButtonDisabled}>Withdraw</Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
            <Grid item>
                <ExitButton/>
            </Grid>
        </Grid>
    );
}

export default Withdrawal;
