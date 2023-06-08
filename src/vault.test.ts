import {BankNote, deduct, getCashInVault, getTotal, testInitHelper} from "./vault";
import lodash from 'lodash';
import {
    findClosestMatch,
    getCombinations,
    getCombinationsWithMaxNoOfDenominations,
    getMaxNumberOfDenominations,
    pickEvenlyDistributedCombination
} from "./vaultUtils";

beforeEach(() => {
    testInitHelper();
});

test('should initialise the vault with right configuration', () => {
    const vault = getCashInVault();
    expect(vault.get(BankNote.TWENTY)).toBe(7);
    expect(vault.get(BankNote.TEN)).toBe(15);
    expect(vault.get(BankNote.FIVE)).toBe(4);
});

test('should return right amount after deduction', () => {
    deduct(BankNote.TWENTY, 7);
    const noTwentiesLeft = getCashInVault();
    expect(noTwentiesLeft.get(BankNote.TWENTY)).toBe(0);
});

test('should calculate total', () => {
    const total = getTotal();
    expect(total).toBe(310);
});

describe('should return the closest match of all denominations to cash in vault', () => {
    it.each([
        [[{"five": 0.45, "ten": 0.01, "twenty": 0.54},
            // {"five": 0.2, "ten": 0.4, "twenty": 0.5},
            // {"five": 0.43, "ten": 0.46, "twenty": 0.02},
            {"five": 0.44, "ten": 0.3, "twenty": 0.26}
        ],
            {"five": 0.45, "ten": 0.48, "twenty": 0.07},
            {"five": 0.44, "ten": 0.3, "twenty": 0.26}], // three combinations
    ])('combinations %p should return %p as combinations with max number of denominations', (
        combinations: { [key: string]: number }[],
        target: { [key: string]: number },
        result: { [key: string]: number }) => {

        expect(lodash.isEqual(findClosestMatch(combinations, target), result)).toBeTruthy();
    });
});

describe('should return all combinations with max number of denominations', () => {
    it.each([
        [[{"5": 3}, {"10": 1, "5": 1}], [{"10": 1, "5": 1}]], // only one combination
        [[{"10": 6}, {"5": 2, "10": 3, "20": 1}, {"5": 2, "10": 1, "20": 2}], [{"5": 2, "10": 3, "20": 1}, {
            "5": 2,
            "10": 1,
            "20": 2
        }]], // multiple combinations have the max number
        [[], []], // zero combination
    ])('combinations %p should return %p as combinations with max number of denominations', (combinations: object[], result: object[]) => {

        expect(lodash.isEqual(getCombinationsWithMaxNoOfDenominations(combinations), result)).toBeTruthy();
    });
});

describe('should get combination with max number of denominations', () => {
    it.each([
        [[{"5": 3}, {"10": 1, "5": 1}], 2], // only one max combination
        [[{"5": 2, "10": 3, "20": 1}, {"5": 2, "10": 1, "20": 2}], 3], // multiple combinations have the max number
        [[], 0], // zero combination
    ])('combinations %p should return %p as max number of denominations', (combinations: object[], result: number) => {
        expect(getMaxNumberOfDenominations(combinations)).toEqual(result);
    });
});

test('should pick most evenly distributed combination', () => {
    const combinations: number[][] = [];
    combinations.push([10], [5, 5]);
    // Test cases:
    // only one max combination
    // multiple max combination
    // all max combination
    // zero combination
    const result = pickEvenlyDistributedCombination(combinations);
});

test('should return optimal combination of notes to dispense', () => {
    // foo();

    let notes = [5, 5, 5, 5, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 20, 20, 20, 20, 20, 20, 20];
    let requestedAmount = 140;
    const combinations: number[][] = getCombinations(notes, requestedAmount);
    if (combinations.length == 0) {
        throw new Error("Not possible to dispense requested amount with cash in vault");
    }
    const result = pickEvenlyDistributedCombination(combinations);
});
