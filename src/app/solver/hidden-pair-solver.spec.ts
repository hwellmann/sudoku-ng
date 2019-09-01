import { getLogger, Logger } from '@log4js2/core';
import { Sudoku } from 'app/generator/sudoku';
import { HiddenPairSolver } from './hidden-pair-solver';
import { Solver } from './solver';
import { StepType } from './step-type';

describe('HiddenPairSolver', () => {
    let log: Logger;
    let solver: Solver;

    beforeEach(() => {
        log = getLogger('HiddenPairSolverSpec');
        solver = new HiddenPairSolver();
    });


    test('should find hidden pair', () => {
        const sudoku = Sudoku.fromString(
            '.62.314......698........61.25...6...9..325..66...9.245.8...2.6.52697......768.52.');
        solver.sudoku = sudoku;
        const step = solver.findStep();
        expect(step).toBeDefined();
        expect(step.type).toBe(StepType.HIDDEN_PAIR);
        expect(step.insertableCandidates.size).toBe(0);
        expect(step.deletableCandidates.size).toBe(2);
        expect(step.toString()).toBe('Hidden Pair: 7,8 at r3c6 and r6c6, r3c6 != 4');
    });

});
