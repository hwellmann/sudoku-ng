import { Sudoku } from 'app/generator/sudoku';
import { FullHouseSolver } from './full-house-solver';
import { NakedSingleSolver } from './naked-single-solver';
import { StepType } from './step-type';

describe('NakedSingleSolver', () => {

    test('should solve full house row', () => {
        const sudoku = Sudoku.fromString(
            '.........91.283746...............................................................');
        const solver = new NakedSingleSolver();
        solver.sudoku = sudoku;
        const step = solver.findStep();
        expect(step).toBeDefined();
        expect(step.type).toBe(StepType.NAKED_SINGLE);
        expect(step.insertableCandidates.size).toBe(1);
        expect(step.insertableCandidates.get(11).get(5)).toBeTruthy();
        expect(step.deletableCandidates.size).toBe(0);

        solver.executeStep(step);
        expect(sudoku.asString())
            .toBe('.........915283746...............................................................');
    });

    test('should solve row', () => {
        const sudoku = Sudoku.fromString(
            '..6.....591.28374................................................................');
        const solver = new NakedSingleSolver();
        solver.sudoku = sudoku;
        const step = solver.findStep();
        expect(step).toBeDefined();
        expect(step.type).toBe(StepType.NAKED_SINGLE);
        expect(step.insertableCandidates.size).toBe(1);
        expect(step.insertableCandidates.get(11).get(5)).toBeTruthy();
        expect(step.deletableCandidates.size).toBe(0);

        solver.executeStep(step);
        expect(sudoku.asString())
            .toBe('..6.....591528374................................................................');
    });

    test('should solve column', () => {
        const sudoku = Sudoku.fromString(
            '.9........1.................3........2........5........4........8........7.......');
        const solver = new NakedSingleSolver();
        solver.sudoku = sudoku;
        const step = solver.findStep();
        expect(step).toBeDefined();
        expect(step.type).toBe(StepType.NAKED_SINGLE);
        expect(step.insertableCandidates.size).toBe(1);
        expect(step.insertableCandidates.get(19).get(6)).toBeTruthy();
        expect(step.deletableCandidates.size).toBe(0);

        solver.executeStep(step);
        expect(sudoku.asString())
            .toBe('.9........1........6........3........2........5........4........8........7.......');
    });

    test('should solve block', () => {
        const sudoku = Sudoku.fromString(
            '..............................954......123.......67..............................');
        const solver = new NakedSingleSolver();
        solver.sudoku = sudoku;
        const step = solver.findStep();
        expect(step).toBeDefined();
        expect(step.type).toBe(StepType.NAKED_SINGLE);
        expect(step.insertableCandidates.size).toBe(1);
        console.log(step.insertableCandidates);
        expect(step.insertableCandidates.get(48).get(8)).toBeTruthy();
        expect(step.deletableCandidates.size).toBe(0);

        solver.executeStep(step);
        expect(sudoku.asString())
            .toBe('..............................954......123......867..............................');
    });

});
