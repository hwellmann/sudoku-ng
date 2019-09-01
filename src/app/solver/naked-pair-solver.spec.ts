import { getLogger, Logger } from '@log4js2/core';
import { HodokuCandidatesParser } from 'app/generator/hodoku-parser';
import fs from 'fs';
import { NakedPairSolver } from './naked-pair-solver';
import { Solver } from './solver';
import { StepType } from './step-type';

describe('NakedPairSolver', () => {
    let log: Logger;
    let solver: Solver;

    beforeEach(() => {
        log = getLogger('NakedPairSolverSpec');
        solver = new NakedPairSolver();
    });


    test('should find naked pair', () => {
        const text = fs.readFileSync('src/assets/naked-pair-cand.txt', 'utf8');
        const parser = new HodokuCandidatesParser();
        const sudoku = parser.parse(text);
        solver.sudoku = sudoku;
        const step = solver.findStep();
        expect(step).toBeDefined();
        expect(step.type).toBe(StepType.NAKED_PAIR);
        expect(step.toString()).toBe('Naked Pair: 2,9 at r2c6 and r5c6, r3c6 != 2,9');

        expect(solver.canExecuteStep(step)).toBeTruthy();
        solver.executeStep(step);

        const step2 = solver.findStep();
        expect(step2).toBeDefined();
        expect(step2.type).toBe(StepType.NAKED_PAIR);
        expect(step2.toString())
            .toBe('Naked Pair: 1,4 at r7c3 and r9c1, '
                + 'r7c1 != 1,4, r7c2 != 1,4, r8c1 != 1,4, r8c2 != 1,4, r8c3 != 1,4, r9c2 != 1,4, r9c3 != 1,4');
    });

});
