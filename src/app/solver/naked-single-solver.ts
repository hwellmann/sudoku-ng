import { getLogger, Logger } from '@log4js2/core';
import { NUM_DIGITS } from 'app/generator/cell';
import BitSet from 'fast-bitset';
import { Solver } from './solver';
import { SolutionStep } from './solution-step';
import { StepType } from './step-type';

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
        const step = new SolutionStep();
        step.type = StepType.NAKED_SINGLE;
        step.tuple.push(candidate);
        const candidates = new BitSet(NUM_DIGITS + 1);
        candidates.set(candidate);
        step.insertableCandidates.set(index, candidates);
        return step;
    }
}
