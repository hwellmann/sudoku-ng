import { getLogger, Logger } from '@log4js2/core';
import { NUM_DIGITS } from 'app/generator/cell';
import BitSet from 'fast-bitset';
import { Solver } from './solver';
import { SolutionStep } from './solution-step';
import { StepType } from './step-type';
import { Sudoku } from 'app/generator/sudoku';

class NakedSingleSolutionStep extends SolutionStep {
    constructor() {
        super();
        this.type = StepType.NAKED_SINGLE;
    }

    toString(): string {
        const [index, candidates] = this.insertableCandidates.entries().next().value;
        const digit = candidates.nextSetBit(0);
        return `${this.type}: ${Sudoku.getPosition(index)}=${digit}`;
    }
}

export class NakedSingleSolver extends Solver {
    private readonly log: Logger = getLogger('NakedSingleSolver');

    findStep(): SolutionStep {
        for (const cell of this.sudoku.cells) {
            const candidates = cell.candidates;
            console.log(cell.index);
            if (candidates.getCardinality() === 1) {
                const candidate = candidates.nextSetBit(0);
                return this.buildSolutionStep(cell.index, candidate);
            }
        }
        return undefined;
    }

    executeStep(step: SolutionStep): void {
        this.insertCandidates(step);
    }

    canExecuteStep(step: SolutionStep): boolean {
        return StepType.NAKED_SINGLE === step.type;
    }

    private buildSolutionStep(index: number, candidate: number) {
        const step = new NakedSingleSolutionStep();
        step.tuple.push(candidate);
        const candidates = new BitSet(NUM_DIGITS + 1);
        candidates.set(candidate);
        step.insertableCandidates.set(index, candidates);
        return step;
    }
}
