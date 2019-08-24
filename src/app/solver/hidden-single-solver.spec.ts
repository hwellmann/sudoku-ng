import { Sudoku } from 'app/generator/sudoku';
import { FullHouseSolver } from './full-house-solver';
import { NakedSingleSolver } from './naked-single-solver';
import { HiddenSingleSolver } from './hidden-single-solver';
import { StepType } from './step-type';

describe('HiddenSingleSolver', () => {

    test('should find hidden single', () => {
        const sudoku = Sudoku.fromString(
            '..45..72...61...4...1....36.2.6......6..8..1......2.8.59....1...4...92...82..35..');
        const solver = new HiddenSingleSolver();
        solver.sudoku = sudoku;
        const step = solver.findStep();
        expect(step).toBeDefined();
        expect(step.type).toBe(StepType.HIDDEN_SINGLE);
        expect(step.insertableCandidates.size).toBe(1);
        expect(step.insertableCandidates.get(8).get(1)).toBeTruthy();
        expect(step.deletableCandidates.size).toBe(0);

        solver.executeStep(step);
        expect(sudoku.asString())
            .toBe('..45..721..61...4...1....36.2.6......6..8..1......2.8.59....1...4...92...82..35..');
    });

});
