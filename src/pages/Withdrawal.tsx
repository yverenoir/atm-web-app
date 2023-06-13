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
    const [showWithdrawThresholdExceededMsg, setShowWithdrawThresholdExceededMsg] = useState(false);
    const [showOverdraftMsg, setShowOverdraftMsg] = useState(false);
    const [showAmountNotPossibleMsg, setShowAmountNotPossibleMsg] = useState(false);
    const [withdrawUnsuccessfulMsg, setWithdrawUnsuccessfulMsg] = useState(false);
    const [showAmountInsufficientMsg, setShowAmountInsufficientMsg] = useState(false);
    const [withdrawButtonDisabled, setWithdrawButtonDisabled] = useState(true);

    const allowedOverdraftAmount = 100;

    useEffect(() => {
        setMaxAllowedAmount(balance + allowedOverdraftAmount);
    }, [balance]);
    
    function handleAmountChange(e: any) {
        const requestedAmount = e.target.value;
        setAmount(requestedAmount);

        // this is only checked after the user submits the withdraw request
        setShowAmountInsufficientMsg(false);

        // make if else statements into elvis operator statements to set the states
        if (requestedAmount > balance) {
            setShowOverdraftMsg(true);
        } else {
            setShowOverdraftMsg(false);
        }

        const withdrawThresholdExceeded = requestedAmount > maxAllowedAmount;
        if (withdrawThresholdExceeded) {
            setShowWithdrawThresholdExceededMsg(true);
        } else {
            setShowWithdrawThresholdExceededMsg(false);
        }

        const amountNotPossible = requestedAmount % 5 !== 0;
        if (amountNotPossible) {
            setShowAmountNotPossibleMsg(true);
        } else {
            setShowAmountNotPossibleMsg(false);
        }

        if (withdrawThresholdExceeded || amountNotPossible) {
            setWithdrawButtonDisabled(true);
        } else {
            setWithdrawButtonDisabled(false);
        }
    }

    function onWithdrawSubmit(e: any) {
        e.preventDefault();

        if (amount == null) {
            throw new Error("Amount invalid");
        }

        // Checking for total only after the user submits the withdraw request to avoid unneeded calls to the vault
        const totalInVault = getTotal();
        const withdrawalIsAllowed = totalInVault >= amount;
        if (withdrawalIsAllowed) {
            // subtract withdrawn amount from balance
            const withdrawSuccess = withdraw(amount);
            if (!withdrawSuccess) {
                setWithdrawUnsuccessfulMsg(true);
                return;
            }

            setBalance(balance - amount);
            navigate("/withdrawal-success", {state: {balance: balance - amount}});
        } else {
            setShowAmountInsufficientMsg(true);
        }
    }

    function withdraw(amount: number): boolean {
        return withdrawFromVault(amount);
    }

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
                    <Grid item>{showWithdrawThresholdExceededMsg &&
                        <ErrorMsg msg={messages.withdrawThresholdExceeded}/>}</Grid>
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
