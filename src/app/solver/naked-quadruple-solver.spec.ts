import { getLogger, Logger } from '@log4js2/core';
import { HodokuCandidatesParser } from 'app/generator/hodoku-parser';
import fs from 'fs';
import { NakedQuadrupleSolver } from './naked-quadruple-solver';
import { Solver } from './solver';
import { StepType } from './step-type';

describe('NakedQuadrupleSolver', () => {
    let log: Logger;
    let solver: Solver;

    beforeEach(() => {
        log = getLogger('NakedQuadrupleSolverSpec');
        solver = new NakedQuadrupleSolver();
    });


    test('should find naked quadruple', () => {
        const text = fs.readFileSync('src/assets/naked-quadruple-cand.txt', 'utf8');
        const parser = new HodokuCandidatesParser();
        const sudoku = parser.parse(text);
        solver.sudoku = sudoku;
        const step = solver.findStep();
        expect(step).toBeDefined();
        expect(step.type).toBe(StepType.NAKED_QUADRUPLE);
        expect(step.toString()).toBe('Naked Quadruple: 4,6,7,9 at r7c3, r8c2, r8c3 and r9c3, '
            + 'r7c1 != 4,6, r7c2 != 4,6,9, r8c1 != 4, r9c1 != 4,6, r9c2 != 4,6');

        expect(solver.canExecuteStep(step)).toBeTruthy();
        solver.executeStep(step);

        const step2 = solver.findStep();
        expect(step2).toBeDefined();
        expect(step2.type).toBe(StepType.NAKED_QUADRUPLE);
        expect(step2.toString()).toBe('Naked Quadruple: 1,2,3,8 at r4c1, r7c1, r8c1 and r9c1, r5c1 != 8');

        expect(solver.canExecuteStep(step2)).toBeTruthy();
        solver.executeStep(step2);

        const step3 = solver.findStep();
        expect(step3).toBeUndefined();
    });

});
