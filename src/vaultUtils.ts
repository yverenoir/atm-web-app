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

export const occurrences = (list: number[]) => list.reduce(function (acc: any, curr: number) {
    return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
}, {});

export function pickEvenlyDistributedCombination(combinations: number[][]) {
    const groupedCombinations: { [key: string]: number }[] = combinations.map(value => occurrences(value));
    console.log(groupedCombinations);
    // prefer dispensing all denominations
    // get combinations with highest number of denominations
    const filtered = getCombinationsWithMaxNoOfDenominations(groupedCombinations);
    // prefer close to vault balance
    const target = {"20": 0.45, "10": 0.48, "5": 0.06};
    const result = findClosestMatch(filtered, target);
    return result;
    // [{"10": 0.45, "20": 0.55}, {"10": 0.2, "20": 0.8}]
    // target {"10": 0.5, "20": 0.5}
}

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

export function getCombination(startIndex: number, sum: number, requestedAmount: number, tmpResult: number[], notes: number[], result: number[][]) {
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
