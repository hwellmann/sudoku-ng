import { getLogger, Logger } from '@log4js2/core';
import { Sudoku } from 'app/generator/sudoku';
import { HiddenPairSolver } from './hidden-pair-solver';
import { Solver } from './solver';
import { StepType } from './step-type';
import { loadavg } from 'os';

describe('NakedPairSolver', () => {
    let log: Logger;
    let solver: Solver;

    beforeEach(() => {
        log = getLogger('NakedPairSolverSpec');
        solver = new HiddenPairSolver();
    });


    test('should find hidden pair', () => {
        const sudoku = Sudoku.fromString(
            '98...6..537..5.1.....7...6..6.34...8.........72.....9....2.57................862.');
        solver.sudoku = sudoku;
        const step = solver.findStep();
        expect(step).toBeDefined();
        expect(step.type).toBe(StepType.HIDDEN_PAIR);
        expect(step.insertableCandidates.size).toBe(0);
        expect(step.deletableCandidates.size).toBe(2);
        expect(step.toString()).toBe('Hidden Pair: 7,8 at r3c6 and r6c6, r3c6 != 4');
    });

});
