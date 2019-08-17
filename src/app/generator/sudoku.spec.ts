import { NUM_CELLS, Sudoku } from './sudoku';

describe('Sudoku', () => {

    test('should be empty', () => {
        const sudoku = new Sudoku();
        expect(sudoku.asString())
            .toEqual('.................................................................................');
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

    test('should get row', () => {
        expect(Sudoku.getRow(15))
            .toEqual(1);
    });

    test('should read puzzle from string', () => {
        const sudoku =
            Sudoku.fromString('......8..6.83.75.1..9.6.2.38.2..69.47...31.2.5...491.79.36..4.84..9.3.5.2..714.69');
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

    test('should read from solution', () => {
        const solvedSudoku = {
            puzzle: '7....3.....9....3..5.7...9....2..4...7....9.6....8.....268...5.1....9...5....7.84',
            solution: '761593842249168537358742691935276418874315926612984375426831759187459263593627184'
        };
        const sudoku = Sudoku.fromSolvedSudoku(solvedSudoku);
        expect(sudoku.getCell(1).isCandidate(6))
            .toBeTruthy();
        expect(sudoku.getCell(1).solution)
            .toEqual(6);
        expect(sudoku.asString())
            .toEqual(solvedSudoku.puzzle);
        expect(sudoku.solutionAsString)
            .toEqual(solvedSudoku.solution);
    });

});
