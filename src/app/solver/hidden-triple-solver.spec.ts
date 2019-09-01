import { getLogger, Logger } from '@log4js2/core';
import { Sudoku } from 'app/generator/sudoku';
import { HiddenTripleSolver } from './hidden-triple-solver';
import { Solver } from './solver';
import { StepType } from './step-type';

describe('HiddenTripleSolver', () => {
    let log: Logger;
    let solver: Solver;

    beforeEach(() => {
        log = getLogger('HiddenTripleSolverSpec');
        solver = new HiddenTripleSolver();
    });


    test('should find hidden triple', () => {
        const sudoku = Sudoku.fromString(
            '5..62..37..489........5....93........2....6.57.......3.....9.........7..68.57...2');
        solver.sudoku = sudoku;
        const step = solver.findStep();
        expect(step).toBeDefined();
        expect(step.type).toBe(StepType.HIDDEN_TRIPLE);
        expect(step.insertableCandidates.size).toBe(0);
        expect(step.deletableCandidates.size).toBe(3);
        expect(step.toString()).toBe('Hidden Triple: 2,5,6 at r4c6, r6c6 and r8c6, r4c6 != 1,4,7,8, r6c6 != 1,4,8, r8c6 != 1,3,4,8');
    });

});
