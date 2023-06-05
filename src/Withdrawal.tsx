import React, {useEffect, useState} from 'react';
import './App.css';
import {useLocation} from "react-router-dom";
import {Button, TextField} from "@mui/material";

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

    const [balance, setBalance] = useState<number | undefined>(balanceFromState);
    const [maxAllowedAmount, setMaxAllowedAmount] = useState<number>(0);
    const [showAmountInsufficientMsg, setShowAmountInsufficientMsg] = useState(false);
    const [withdrawButtonDisabled, setWithdrawButtonDisabled] = useState(true);

    const allowedOverdraftAmount = 100;

    useEffect(() => {
        if (balance !== undefined) {
            setMaxAllowedAmount(balance + allowedOverdraftAmount);
        }
    }, [balance]);

    function handleAmountChange(e: any) {
        const requestedAmount = e.target.value;
        setAmount(requestedAmount);

        if (requestedAmount > maxAllowedAmount) {
            setShowAmountInsufficientMsg(true);
            setWithdrawButtonDisabled(true);
            return;
        }

        setShowAmountInsufficientMsg(false);
        setWithdrawButtonDisabled(false);
        // display message if amount is bigger than allowed amount
        // disable withdraw button if amount is bigger than allowed
        // disable withdraw button if ATM not able to dispense (mod 5)
    }

    function onWithdrawSubmit(e: any) {
        e.preventDefault();
        console.log('withdraw amount: ', amount);
        const withdrawalIsAllowed = true;
        // display message if user is overdrawing
        if (withdrawalIsAllowed) {
            // substract withdrawn amount from balance
            if (balance !== undefined && amount !== null) {
                setBalance(balance - amount);
            } else {
                throw new Error("Balance or amount are invalid");
            }
        }
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
