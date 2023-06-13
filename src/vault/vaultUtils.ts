import {BankNote} from "./vault";

// Returns evenly balanced notes for requested amount
export function getNotes(cashInVault: Map<BankNote, number>, requestedAmount: number): Map<BankNote, number> | null {
    console.log('getNotes for amount: ', requestedAmount);
    // transforms data structure for next step
    const flattened = flattenNotes(cashInVault);
    console.log('flattened notes: ', flattened);

    // get all possible combinations given the cash in vault
    const combinations = getCombinations(flattened, requestedAmount);
    console.log('combinations: ', combinations);
    // no combination found
    if (combinations.length === 0) return null;

    // pick the most evenly distributed combination
    const bestCombination = pickEvenlyDistributedCombination(combinations, cashInVault);

    // transforms back into original data structure
    return bestCombination !== null ? transformIntoBankNotes(bestCombination) : bestCombination;
}

// Returns all unique combinations out of given notes to sum up to the requested amount
export function getCombinations(notes: number[], requestedAmount: number): number[][] {
    console.log('getCombinations');
    notes.sort((a, b) => a - b);

    // The result list has all possible combinations: [ [5,5,10] , [5,5,5,5] ]
    // The tmpResult list stores one combination for the result list
    let tmpResult: number[] = [];
    let result: number[][] = [];

    getCombination(0, 0, requestedAmount, tmpResult, notes, result);

    console.log('combinations found: ', result);

    return result;
}

// Helper to recursively search for unique note combinations
function getCombination(startIndex: number, sum: number, requestedAmount: number, tmpResult: number[], notes: number[], result: number[][]) {
    console.log('getCombination running');
    // sum of found notes matches with requested amount
    // => combination is valid => add combination to result list
    console.log('sum and requestedAmount ', sum, " ", requestedAmount);
    if (sum == requestedAmount) {
        result.push([...tmpResult]);
        console.log('result: ', result);
        return;
    }

    for (let i = startIndex; i < notes.length; i++) {
        if (sum + notes[i] > requestedAmount)
            continue;

        if (i > startIndex && notes[i] === notes[i - 1])
            continue;

        // add note into the combination
        tmpResult.push(notes[i]);
        getCombination(i + 1, sum + notes[i], requestedAmount, tmpResult, notes, result);
        tmpResult.pop();
    }
}

// Finds out the max number of unique denominations used among given combinations
// [{"5": 1, "10": 2}, {"5": 1, "10": 1, "20": 1}] -> 3
export function getMaxNumberOfDenominations(combinations: Record<string, number>[]): number {
    let maxNumberOfDenominations = 0;
    combinations.forEach(combination => {
        const numberOfNotes = Object.keys(combination).length;
        if (numberOfNotes > maxNumberOfDenominations) {
            maxNumberOfDenominations = numberOfNotes;
        }
    })
    return maxNumberOfDenominations;
}

export function getCombinationsWithMaxNoOfDenominations(groupedCombinations: Record<string, number>[]): {
    [key: string]: number
}[] {
    const maxNoOfDenominations = getMaxNumberOfDenominations(groupedCombinations);
    return groupedCombinations.filter(combination => Object.keys(combination).length === maxNoOfDenominations);
}

// Helper to count notes per denomination
// [5,5,5] -> {"5": 3}
export const occurrences = (list: number[]) => list.reduce <{
    [key: string]: number
}>(function (acc: any, curr: number) {
    return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
}, {});

// [{"10": 2, "20": 1}] -> [{"10": 0.5, "20": 0.5}]
export function getDistributionOfNotes(combinations: Record<string, number>[]): Record<string, number>[] {
    const result: Record<string, number>[] = [];
    combinations
        .forEach(combination => {
                const tmp: Record<string, number> = {};
                const total = getTotalOfNotes(combination);
                Object.entries(combination)
                    .forEach(value => tmp[value[0]] = value[1] * parseInt(value[0]) / total);
                result.push(tmp);
            }
        );
    return result;
}

function getTotalOfNotes(combination: Record<string, number>): number {
    let total = 0;
    Object.entries(combination).forEach(value => {
        const denomination = value[0];
        const count = value[1];
        total += parseInt(denomination) * count;
    });
    return total;
}

// Returns map of distribution of each note's monetary value compared to the total monetary value in vault
// {BankNote.TEN: 2, BankNote.TWENTY: 1} -> {"10": 0.5, "20": 0.5}
export function getDistributionOfNotesToTotalValue(cashInVault: Map<BankNote, number>): Record<string, number> {
    const totalCashInVault = calculateTotal(cashInVault);
    const result: Record<string, number> = {};
    cashInVault.forEach((count, bankNote) =>
        result[bankNote.valueOf()] = (count * bankNote.valueOf()) / totalCashInVault);
    return result;
}

export function calculateTotal(cash: Map<BankNote, number>): number {
    let total = 0;
    cash.forEach((count, bankNote) => total += bankNote * count);
    return total;
}

// Chooses combination of notes with max variance AND
// which comes closest to the distribution of notes in the ATM cassette
export function pickEvenlyDistributedCombination(combinations: number[][], cashInVault: Map<BankNote, number>): Record<string, number> | null {
    console.log('pickEvenlyDistributedCombination');
    // count number of notes and group by denomination
    const groupedCombinations: Record<string, number>[] = combinations.map(value => occurrences(value));
    console.log('groupedCombinations: ', groupedCombinations);

    // get combinations with highest number of denominations used among possible combinations
    const combinationsWithMaxNoOfDenominations = getCombinationsWithMaxNoOfDenominations(groupedCombinations);

    // chose one which is closest to vault's denominations
    const target = getDistributionOfNotesToTotalValue(cashInVault);
    const distributionOfCombination = getDistributionOfNotes(combinationsWithMaxNoOfDenominations);
    const indexOfClosestMatch = findClosestMatchByIndex(distributionOfCombination, target);
    return combinationsWithMaxNoOfDenominations[indexOfClosestMatch];
}

// Returns index of combination with denominations which comes closest to denominations in vault
// combinations: list of combinations, e.g. [{"20": 0.5, "10": 0.5}], representing that 50% of values in combination consists of 10 and 20 GBP bills respectively
// target: denominations in vault, e.g. {"20": 0.5, "10": 0.5}, representing that 50% of values in vault consists of 10 and 20 GBP bills respectively
// return: index of combination
export function findClosestMatchByIndex(combinations: Record<string, number>[], target: {
    [key: string]: number
}): number {
    let indexOfClosestMatch = 0;
    // represents the sum of all distances between denomination
    let closestDistance = Number.MAX_VALUE;

    combinations.forEach((combination, index,) => {
        let distance = 0;

        for (const key in target) {
            if (combination.hasOwnProperty(key)) {
                distance += Math.abs(combination[key] - target[key]);
            }
        }

        if (distance < closestDistance) {
            indexOfClosestMatch = index;
            closestDistance = distance;
        }
    });

    return indexOfClosestMatch;
}

// Helper to transform shape of notes from map to flat array with duplicates
// { BankNote.FIVE: 3 } => [5,5,5]
export function flattenNotes(cash: Map<BankNote, number>): number[] {
    const result: number[] = [];
    cash.forEach((count, bankNote) => {
        for (let i = 0; i < count; i++) {
            result.push(bankNote.valueOf());
        }
    });
    return result;
}

export function transformIntoBankNotes(bestCombination: Record<string, number>): Map<BankNote, number> {
    const result = new Map<BankNote, number>();
    for (let key in bestCombination) {
        switch (key) {
            case BankNote.TWENTY.valueOf().toString(): {
                result.set(BankNote.TWENTY, bestCombination[key]);
                break;
            }
            case BankNote.TEN.valueOf().toString(): {
                result.set(BankNote.TEN, bestCombination[key]);
                break;
            }
            case BankNote.FIVE.valueOf().toString(): {
                result.set(BankNote.FIVE, bestCombination[key])
                break;
            }
        }
    }
    return result;
}