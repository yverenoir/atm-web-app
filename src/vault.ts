// This file is to ensure read and write operations of the vault happen in a controlled layer
// In a production environment, the vault should be a secure single source of truth
// where data read and write should only happen when the caller has the right to perform these actions

import {calculateTotal} from "./vaultUtils";

export enum BankNote {
    TWENTY = 20,
    TEN = 10,
    FIVE = 5,
}

function init(): Map<BankNote, number> {
    const result = new Map<BankNote, number>();
    result.set(BankNote.TWENTY, 7);
    result.set(BankNote.TEN, 15);
    result.set(BankNote.FIVE, 4);
    return result;
}

const cash: Map<BankNote, number> = init();

export const getCashInVault = () => cash;

export const getTotal = () => {
    return calculateTotal(cash);
}

export const deduct = (note: BankNote, noteCount: number) => {
    const noteInVault = cash.get(note);
    const countInVault: number = noteInVault === undefined ? 0 : noteInVault;
    const invalidCount = countInVault < noteCount;
    if (invalidCount) {
        throw new Error('Not allowed');
    }
    cash.set(note, countInVault - noteCount);
}

// This can be viewed as a database seed script
export function testInitHelper() {
    cash.set(BankNote.TWENTY, 7);
    cash.set(BankNote.TEN, 15);
    cash.set(BankNote.FIVE, 4);
}

export function withdraw(amount: number): boolean {
    // find best possible combination of notes to satisfy amount


    // deduct amount from vault

    // return true if withdraw successful, return false if withdraw unsuccessful
    return true;
}