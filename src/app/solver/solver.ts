import { Sudoku } from 'app/generator/sudoku';
import { SolutionStep } from './solution-step';
import BitSet from 'fast-bitset';

export abstract class Solver {
    protected theSudoku: Sudoku;

    get sudoku(): Sudoku {
        return this.theSudoku;
    }

    set sudoku(s: Sudoku) {
        this.theSudoku = s;
    }

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

    addDeletableCandidates(step: SolutionStep, index: number, deletable: BitSet): void {
        const candidates = this.sudoku.getCell(index).candidates;
        const diff = candidates.and(candidates.xor(deletable));
        step.deletableCandidates.set(index, diff);
    }

}
