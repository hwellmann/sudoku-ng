import { getLogger, Logger } from '@log4js2/core';
import { Cell, DIGITS, NUM_DIGITS } from 'app/generator/cell';
import { ALL_UNITS, Sudoku } from 'app/generator/sudoku';
import BitSet from 'fast-bitset';
import { SolutionStep } from './solution-step';
import { Solver } from './solver';
import { StepType } from './step-type';

class HiddenSingleSolutionStep extends SolutionStep {
    constructor() {
        super();
        this.type = StepType.HIDDEN_SINGLE;
    }

    toString(): string {
        const [index, candidates] = this.insertableCandidates.entries().next().value;
        const digit = candidates.nextSetBit(0);
        return `${this.type}: ${Sudoku.getPosition(index)}=${digit}`;
    }
}

export class HiddenSingleSolver extends Solver {
    private readonly log: Logger = getLogger('HiddenSingleSolver');

    findStep(): SolutionStep {
        let unitIndex = 0;
        for (const indices of ALL_UNITS) {
            for (const digit of DIGITS) {
                const step = this.findHiddenSingle(digit, indices, unitIndex);
                if (step !== undefined) {
                    return step;
                }
            }
            unitIndex++;
        }
        return undefined;
    }

    executeStep(step: SolutionStep): void {
        this.insertCandidates(step);
    }

    private findHiddenSingle(digit: number, indices: number[], unitIndex: number) {
        let hiddenIndex: number;
        for (const index of indices) {
            const cell: Cell = this.sudoku.getCell(index);
            if (cell.isCandidate(digit)) {
                if (hiddenIndex === undefined) {
                    hiddenIndex = index;
                } else {
                    return undefined;
                }
            }
        }
        if (hiddenIndex !== undefined) {
            return this.buildSolutionStep(hiddenIndex, digit, unitIndex);
        }
    }

    canExecuteStep(step: SolutionStep): boolean {
        return StepType.HIDDEN_SINGLE === step.type;
    }

    private buildSolutionStep(index: number, candidate: number, unitIndex: number) {
        const step = new HiddenSingleSolutionStep();
        step.unit = unitIndex;
        step.tuple.push(candidate);
        const candidates = new BitSet(NUM_DIGITS + 1);
        candidates.set(candidate);
        step.insertableCandidates.set(index, candidates);
        return step;
    }
}
