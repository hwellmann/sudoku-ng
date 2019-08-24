import { Sudoku } from 'app/generator/sudoku';
import { SolutionStep } from './solution-step';

export abstract class Solver {
    sudoku: Sudoku;
    abstract findStep(): SolutionStep;
    abstract executeStep(step: SolutionStep): void;
    abstract canExecuteStep(step: SolutionStep): boolean;

    insertCandidates(step: SolutionStep): void {
        step.insertableCandidates.forEach((candidates, index) => {
            const candidate = candidates.nextSetBit(0);
            this.sudoku.setCell(index, candidate);
        });
    }

    deleteCandidates(step: SolutionStep): void {
        step.deletableCandidates.forEach((candidates, index) => {
            candidates.forEach(candidate => this.sudoku.getCell(index).removeCandidate(candidate));
        });
    }
}