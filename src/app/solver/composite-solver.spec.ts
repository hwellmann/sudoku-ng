import { Sudoku } from 'app/generator/sudoku';
import { FullHouseSolver } from './full-house-solver';
import { NakedSingleSolver } from './naked-single-solver';
import { StepType } from './step-type';
import { CompositeSolver } from './composite-solver';
import { HiddenSingleSolver } from './hidden-single-solver';
import { Logger, getLogger } from '@log4js2/core';

describe('CompositeSolver', () => {
    let log: Logger;
    let solver: CompositeSolver;

    beforeEach(() => {
        log = getLogger('CompositeSolverSpec');
        solver = new CompositeSolver([new FullHouseSolver(), new NakedSingleSolver(), new HiddenSingleSolver()]);
    });


    test('should solve easy puzzle', () => {
        const sudoku = Sudoku.fromString(
            '..45..72...61...4...1....36.2.6......6..8..1......2.8.59....1...4...92...82..35..');
        solver.sudoku = sudoku;
        const steps = solver.solveAll();
        expect(sudoku.isSolved()).toBeTruthy();
        expect(sudoku.asString())
            .toBe('834596721276138945951427836428671359769385412315942687593264178147859263682713594');
        steps.forEach(step => log.info(step));
    });

});
