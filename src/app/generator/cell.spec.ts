import { Cell, DIGITS } from "./cell";

describe("Cell", () => {
    let cell: Cell;
    beforeEach(() => cell = new Cell(5));

    test("should be created with index", () => {
        expect(cell.isEmpty())
            .toBeTruthy();
        expect(cell.isFilled())
            .toBeFalsy();
        expect(cell.isUnsatisfiable())
            .toBeFalsy();
    });

    test("should be filled", () => {
        cell.value = 3;
        expect(cell.isEmpty())
            .toBeFalsy();
        expect(cell.isFilled())
            .toBeTruthy();
        expect(cell.isUnsatisfiable())
            .toBeFalsy();
        expect(cell.isUnsatisfiable())
            .toBeFalsy();
        expect(cell.asString())
            .toEqual("3");
    });

    test("should be unsatisfiable", () => {
        DIGITS.forEach(digit => cell.removeCandidate(digit));
        expect(cell.isUnsatisfiable())
            .toBeTruthy();
    });

    test("should be created as copy", () => {
        cell.removeCandidate(2);
        cell.removeCandidate(4);
        const copy = new Cell(cell);
        expect(copy.index)
            .toEqual(5);
        [1, 3, 5, 6, 7, 8, 9].forEach(digit => expect(copy.isCandidate(digit))
            .toBeTruthy());
        expect(copy.isCandidate(2))
            .toBeFalsy();
        expect(copy.isCandidate(4))
            .toBeFalsy();
    });

});
