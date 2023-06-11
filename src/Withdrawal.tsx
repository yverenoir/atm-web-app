import React, {useEffect, useState} from 'react';
import './App.css';
import {useLocation} from "react-router-dom";
import {Button, TextField} from "@mui/material";
import {getTotal, withdraw as withdrawFromVault} from "./vault";

// He’s going to make 3 withdrawals:
// ●	£140
// ●	£50
// ●	£90

// 4 x £5 notes
// 15 x £10 notes
// 7 x £20 notes
// You should try to give a roughly even mix of notes when possible, and will have to take into account what to do when certain ones run out.
// Your ATM allows an overdraft of up to £100 and should let users know if they do go overdrawn 😬

function Withdrawal() {
    const location = useLocation();
    const [amount, setAmount] = useState<number | null>(null);

    const balanceFromState = location.state?.balance;

    const [balance, setBalance] = useState<number>(balanceFromState == undefined ? NaN : balanceFromState);
    const [maxAllowedAmount, setMaxAllowedAmount] = useState<number>(0);
    const [showAmountInsufficientMsg, setShowAmountInsufficientMsg] = useState(false);
    const [showOverdraftMsg, setShowOverdraftMsg] = useState(false);
    const [showAmountNotPossibleMsg, setShowAmountNotPossibleMsg] = useState(false);
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
            withdraw(amount);
            setBalance(balance - amount);
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
    function withdraw(amount: number) {
        withdrawFromVault(amount);
    }

    function onEndTransaction() {
        // invalidate auth token
        // redirect user back to pin page
    }

    // check for auth status, only show this page when user is logged in
    return (
        <div>
            Balance: £{balance}
            {showAmountInsufficientMsg && <div>Requested amount is bigger than allowed withdrawal amount</div>}
            {showOverdraftMsg &&
                <div>Requested amount is bigger than actual balance, you will be going into minus after this
                    withdrawal</div>}
            {showAmountNotPossibleMsg &&
                <div>You can only draw a multiple of 5</div>}
            <form onSubmit={onWithdrawSubmit}>
                <TextField label="Amount" variant="outlined" type={"number"} value={amount}
                           onChange={handleAmountChange}/>
                <Button type={"submit"} variant={"outlined"} disabled={withdrawButtonDisabled}>Withdraw</Button>
            </form>
            <Button variant={"outlined"} onClick={onEndTransaction}>End transaction</Button>
        </div>
    );
}

export default Withdrawal;
