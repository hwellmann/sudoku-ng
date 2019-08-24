import { SolutionStep } from './solution-step';
import { Solver } from './solver';

export class CompositeSolver extends Solver {

    constructor(private delegates: Solver[]) {
        super();
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
}
