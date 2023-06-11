import {BankNote} from "./vault";

export function getMaxNumberOfDenominations(combinations: object[]) {
    let maxNumberOfDenominations = 0;
    combinations.forEach(combination => {
        const numberOfNotes = Object.keys(combination).length;
        if (numberOfNotes > maxNumberOfDenominations) {
            maxNumberOfDenominations = numberOfNotes;
        }
    })
    return maxNumberOfDenominations;
}

export function getCombinationsWithMaxNoOfDenominations(groupedCombinations: { [key: string]: number }[]): {
    [key: string]: number
}[] {
    const maxNoOfDenominations = getMaxNumberOfDenominations(groupedCombinations);
    return groupedCombinations.filter(combination => Object.keys(combination).length === maxNoOfDenominations);
}

// TODO: type { [key: string]: number } as Record<string, number>

// Helper to count notes per denomination
// [5,5,5] -> {"5": 3}
export const occurrences = (list: number[]) => list.reduce <{
    [key: string]: number
}>(function (acc: any, curr: number) {
    return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
}, {});

// [{"10": 2, "20": 1}] -> [{"10": 0.5, "20": 0.5}]
export function getDistributionOfNotes(combinations: { [key: string]: number }[]): Record<string, number>[] {
    const result: Record<string, number>[] = [];
    combinations
        .forEach(combination => {
                const tmp: { [key: string]: number } = {};
                const total = getTotal(combination);
                Object.entries(combination)
                    .forEach(value => tmp[value[0]] = value[1] * parseInt(value[0]) / total);
                result.push(tmp);
            }
        );
    return result;
}

function getTotal(combination: { [key: string]: number }): number {
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
function transformDistributionToCount(closestMatch: { [p: string]: number } | null) {

}

// which comes closest to the distribution of notes in the ATM cassette
export function pickEvenlyDistributedCombination(combinations: number[][], cashInVault: Map<BankNote, number>): Record<string, number> | null {
    const groupedCombinations: { [key: string]: number }[] = combinations.map(value => occurrences(value));
    console.log(groupedCombinations);
    // prefer dispensing all denominations
    // get combinations with highest number of denominations
    const combinationsWithMaxNoOfDenominations = getCombinationsWithMaxNoOfDenominations(groupedCombinations);
    // prefer close to vault balance
    const target = getDistributionOfNotesToTotalValue(cashInVault);
    const distributionOfCombination = getDistributionOfNotes(combinationsWithMaxNoOfDenominations);
    // const closestMatch = findClosestMatch(distributionOfCombination, target);
    const indexOfClosestMatch = findClosestMatchByIndex(distributionOfCombination, target);
    return combinationsWithMaxNoOfDenominations[indexOfClosestMatch];
}

export function findClosestMatchByIndex(combinations: { [key: string]: number }[], target: {
    [key: string]: number
}): number {
    let closestMatch: { [key: string]: number } | null = null;
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
            closestMatch = combination;
            indexOfClosestMatch = index;
            closestDistance = distance;
        }
    });

    return indexOfClosestMatch;
}

// Returns one combination of denominations which comes closest to denominations in vault
// combinations: list of combinations, e.g. [{"20": 0.5, "10": 0.5}], representing that 50% of values in combination consists of 10 and 20 GBP bills respectively
// target: denominations in vault, e.g. {"20": 0.5, "10": 0.5}, representing that 50% of values in vault consists of 10 and 20 GBP bills respectively
export function findClosestMatch(combinations: { [key: string]: number }[], target: { [key: string]: number }): {
    [key: string]: number
} | null {
    let closestMatch: { [key: string]: number } | null = null;
    let closestDistance = Number.MAX_VALUE;

    for (const combination of combinations) {
        let distance = 0;

        for (const key in target) {
            if (combination.hasOwnProperty(key)) {
                distance += Math.abs(combination[key] - target[key]);
            }
        }

        if (distance < closestDistance) {
            closestMatch = combination;
            closestDistance = distance;
        }
    }

    return closestMatch;
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

export function getNotes(cashInVault: Map<BankNote, number>, requestedAmount: number): Map<BankNote, number> | null {
    const flattened = flattenNotes(cashInVault);
    const combinations = getCombinations(flattened, requestedAmount);
    const bestCombination = pickEvenlyDistributedCombination(combinations, cashInVault);
    return bestCombination !== null ? transformIntoBankNotes(bestCombination) : bestCombination;
}

// Returns all unique combinations out of given notes to sum up to the requested amount
export function getCombinations(notes: number[], requestedAmount: number): number[][] {
    notes.sort((a, b) => a - b);

    // The result list has all possible combinations: [ [5,5,10] , [5,5,5,5] ]
    // The tmpResult list stores one combination for the result list
    let tmpResult: number[] = [];
    let result: number[][] = [];

    getCombination(0, 0, requestedAmount, tmpResult, notes, result);

    console.log(result);

    return result;
}

// Helper to recursively search for unique note combinations
function getCombination(startIndex: number, sum: number, requestedAmount: number, tmpResult: number[], notes: number[], result: number[][]) {
    // sum of found notes matches with requested amount
    // => combination is valid => add combination to result list
    if (sum === requestedAmount) {
        result.push([...tmpResult]);
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
