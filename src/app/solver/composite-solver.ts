import { SolutionStep } from './solution-step';
import { Solver } from './solver';
import { Sudoku } from 'app/generator/sudoku';

export class CompositeSolver extends Solver {

    constructor(private delegates: Solver[]) {
        super();
    }

    set sudoku(s: Sudoku) {
        this.theSudoku = s;
        this.delegates.forEach(d => d.sudoku = s);
    }

    get sudoku(): Sudoku {
        return this.theSudoku;
    }

    findStep(): SolutionStep {
        return this.delegates.map(d => d.findStep()).find(step => step !== undefined);
    }

    executeStep(step: SolutionStep): void {
        const delegate = this.delegates.find(d => d.canExecuteStep(step));
        delegate.executeStep(step);
    }

    canExecuteStep(step: SolutionStep): boolean {
        return this.delegates.find(delegate => delegate.canExecuteStep(step)) !== undefined;
    }

    solveAll(): SolutionStep[] {
        const steps: SolutionStep[] = [];
        while (!this.sudoku.isSolved()) {
            const step = this.findStep();
            if (step !== undefined) {
                steps.push(step);
                this.executeStep(step);
            } else {
                break;
            }
        }
        return steps;
    }
}
