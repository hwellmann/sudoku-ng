import { getLogger, Logger } from '@log4js2/core';
import { Sudoku } from 'app/generator/sudoku';
import { HiddenTripleSolver } from './hidden-triple-solver';
import fs from 'fs';
import { Solver } from './solver';
import { StepType } from './step-type';
import { HiddenQuadrupleSolver } from './hidden-quadruple-solver';
import { HodokuCandidatesParser } from 'app/generator/hodoku-parser';

describe('HiddenQuadrupleSolver', () => {
    let log: Logger;
    let solver: Solver;

    beforeEach(() => {
        log = getLogger('HiddenQuadrupleSolverSpec');
        solver = new HiddenQuadrupleSolver();
    });


    test('should find hidden quadruple', () => {
        const text = fs.readFileSync('src/assets/hidden-quadruple-cand.txt', 'utf8');
        const parser = new HodokuCandidatesParser();
        const sudoku = parser.parse(text);
        solver.sudoku = sudoku;
        const step = solver.findStep();
        expect(step).toBeDefined();
        expect(step.type).toBe(StepType.HIDDEN_QUADRUPLE);
        expect(step.insertableCandidates.size).toBe(0);
        expect(step.deletableCandidates.size).toBe(4);
        expect(step.toString()).toBe('Hidden Quadruple: 1,4,6,7 at r8c7, r8c9, r9c7 and r9c9, '
            + 'r8c7 != 3,5,8, r8c9 != 3,8,9, r9c7 != 3,5,8, r9c9 != 3,8');

        expect(solver.canExecuteStep(step)).toBeTruthy();
        solver.executeStep(step);

        const step2 = solver.findStep();
        expect(step2).toBeUndefined();
    });
});
