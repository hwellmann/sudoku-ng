import { getLogger, Logger } from '@log4js2/core';
import { BacktrackingGenerator } from './backtracking-generator';
import { BacktrackingSolver } from './backtracking-solver';
import { Sudoku } from './sudoku';

describe('BacktrackingSolver', () => {
    let log: Logger;
    let generator: BacktrackingGenerator;
    let solver: BacktrackingSolver;

    beforeEach(() => {
        log = getLogger('BacktrackingGenerator');
        generator = new BacktrackingGenerator();
        solver = new BacktrackingSolver();
    });

    test('shouldSolve', () => {
        const sudoku = Sudoku.fromString(
            '7....3.....9....3..5.7...9....2..4...7....9.6....8.....268...5.1....9...5....7.84');
        const solutions = solver.solve(sudoku);
        expect(solutions.length)
            .toBe(1);
        expect(solutions[0].asString())
            .toBe('761593842249168537358742691935276418874315926612984375426831759187459263593627184');
    });

    test('should find three solutions', () => {
        const sudoku = Sudoku.fromString(
            '.7.........4.1..3..3...679..1.6..2......2......6..5.83..9.....41....836.5..9...1.');
        const solutions = solver.solve(sudoku);
        expect(solutions.length)
            .toBe(3);
        const solutionStrings = solutions.map(s => s.asString());
        expect(solutionStrings)
            .toContain('671593428924817635835246791413689257758321946296475183389162574142758369567934812');
        expect(solutionStrings)
            .toContain('671593428294817635835246791413689257758321946926475183389162574142758369567934812');
        expect(solutionStrings)
            .toContain('671593428894217635235846791413689257758321946926475183389162574142758369567934812');
    });

    test('ambiguous solution', () => {
        const sudoku = Sudoku.fromString(
            '1279638458695743125438217693916852746821475937543921862184.96.79762.84.1435716928');
        const solutions = solver.solve(sudoku);
        expect(solutions.length)
            .toBe(2);
    });

    test('round trip', () => {
        for (let i = 0; i < 10; i++) {
            const sudoku = generator.generatePuzzle();
            log.info(sudoku.asString());
            const solutions = solver.solve(sudoku);
            expect(solutions.length)
                .toBe(1);
            log.info(solutions[0].asString());
        }
    });
});
