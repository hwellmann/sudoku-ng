import { NUM_CELLS, Sudoku } from "./sudoku";

describe("Sudoku", () => {

    test("should be empty", () => {
        const sudoku = new Sudoku();
        expect(sudoku.asString())
            .toEqual(".................................................................................");
        expect(sudoku.isSolved())
            .toBeFalsy();
        expect(sudoku.isUnsolvable())
            .toBeFalsy();
        for (let index = 0; index < NUM_CELLS; index++) {
            expect(sudoku.getCell(index)
                .isEmpty())
                .toBeTruthy();
        }
    });

    test("should get row", () => {
        expect(Sudoku.getRow(15))
            .toEqual(1);
    });

    test("should read puzzle from string", () => {
        const sudoku =
            Sudoku.fromString("......8..6.83.75.1..9.6.2.38.2..69.47...31.2.5...491.79.36..4.84..9.3.5.2..714.69");
        expect(sudoku.isSolved())
            .toBeFalsy();
        expect(sudoku.isUnsolvable())
            .toBeFalsy();
        expect(sudoku.getCell(80).value)
            .toEqual(9);
        expect(sudoku.getCell(0).candidates
            .getIndices())
            .toEqual([1, 3]);
    });
});
