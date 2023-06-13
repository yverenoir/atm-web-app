import {testInitHelper, withdraw} from "./vault";

beforeEach(() => {
    testInitHelper();
});

describe('should return notes', () => {
    it("", () => {
        expect(withdraw(140)).toBeTruthy();
        // notes: { 5 => 2, 10 => 7, 20 => 3 }
    });
});