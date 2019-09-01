import { getLogger, Logger } from '@log4js2/core';
import { HodokuCandidatesParser } from 'app/generator/hodoku-parser';
import fs from 'fs';
import { NakedTripleSolver } from './naked-triple-solver';
import { Solver } from './solver';
import { StepType } from './step-type';

describe('NakedTripleSolver', () => {
    let log: Logger;
    let solver: Solver;

    beforeEach(() => {
        log = getLogger('NakedTripleSolverSpec');
        solver = new NakedTripleSolver();
    });


    test('should find naked triple', () => {
        const text = fs.readFileSync('src/assets/naked-triple-cand.txt', 'utf8');
        const parser = new HodokuCandidatesParser();
        const sudoku = parser.parse(text);
        solver.sudoku = sudoku;
        const step = solver.findStep();
        expect(step).toBeDefined();
        expect(step.type).toBe(StepType.NAKED_TRIPLE);
        expect(step.toString()).toBe('Naked Triple: 1,2,8 at r2c1, r2c2 and r2c9, r2c3 != 8, r2c4 != 1,2, r2c5 != 1,2, r2c6 != 1,2,8');

        expect(solver.canExecuteStep(step)).toBeTruthy();
        solver.executeStep(step);

        const step2 = solver.findStep();
        expect(step2).toBeDefined();
        expect(step2.type).toBe(StepType.NAKED_TRIPLE);
        expect(step2.toString()).toBe('Naked Triple: 1,2,6 at r1c5, r3c4 and r3c5, r1c4 != 1,2,6, r1c6 != 1,2,6, r3c6 != 1,2,6');

    });

});
