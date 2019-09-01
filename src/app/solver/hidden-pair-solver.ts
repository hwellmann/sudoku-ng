import { getLogger, Logger } from '@log4js2/core';
import { Cell, DIGITS, NUM_DIGITS } from 'app/generator/cell';
import { ALL_UNITS, Sudoku, NUM_CELLS } from 'app/generator/sudoku';
import BitSet from 'fast-bitset';
import { SolutionStep } from './solution-step';
import { Solver } from './solver';
import { StepType } from './step-type';

class HiddenPairSolutionStep extends SolutionStep {
    constructor() {
        super();
        this.type = StepType.HIDDEN_PAIR;
    }

    toString(): string {
        const it = this.deletableCandidates.entries();
        const [index1, candidates1] = it.next().value;
        const [index2, candidates2] = it.next().value;
        const pos1 = Sudoku.getPosition(index1);
        const pos2 = Sudoku.getPosition(index2);
        let msg =  `${this.type}: ${this.tuple} at ${pos1} and ${pos2}`;
        if (!candidates1.isEmpty()) {
            msg += `, ${pos1} != ${candidates1.getIndices()}`;
        }
        if (!candidates2.isEmpty()) {
            msg += `, ${pos2} != ${candidates2.getIndices()}`;
        }
        return msg;
    }
}

export class HiddenPairSolver extends Solver {
    private readonly log: Logger = getLogger('HiddenPairSolver');

    findStep(): SolutionStep {
        let unitIndex = 0;
        for (const indices of ALL_UNITS) {
            const step = this.findHiddenPair(indices, unitIndex);
            if (step !== undefined) {
                return step;
            }
            unitIndex++;
        }
        return undefined;
    }

    executeStep(step: SolutionStep): void {
        this.deleteCandidates(step);
    }

    private findHiddenPair(indices: number[], unitIndex: number): SolutionStep {
        const candidateCellsByDigit = this.buildCandidateCellsByDigit(indices);

        for (const first of DIGITS) {
            const firstCandidates = candidateCellsByDigit[first];
            if (firstCandidates.getCardinality() === 2) {
                for (let second = first + 1; second <= NUM_DIGITS; second++) {
                    const secondCandidates = candidateCellsByDigit[second];
                    const jointCandidates = firstCandidates.or(secondCandidates);
                    if (secondCandidates.getCardinality() === 2 && jointCandidates.getCardinality() === 2) {
                        const foundIndices = jointCandidates.getIndices();
                        if (this.checkAdditionalCandidates(foundIndices)) {
                            return this.buildSolutionStep([first, second], foundIndices, unitIndex);
                        }
                    }
                }
            }
        }
    }

    private checkAdditionalCandidates(pairIndices: number[]) {
        return pairIndices.find(index => this.sudoku.getCell(index).candidates.getCardinality() > 2) !== undefined;
    }

    private buildCandidateCellsByDigit(indices: number[]): Array<BitSet> {
        const candidateCellsByDigit: Array<BitSet> = [new BitSet(NUM_CELLS + 1)];
        for (const digit of DIGITS) {
            const candidateCells = new BitSet(NUM_CELLS + 1);
            for (const index of indices) {
                if (this.sudoku.getCell(index).isCandidate(digit)) {
                    candidateCells.set(index);
                }
            }
            candidateCellsByDigit.push(candidateCells);
        }
        return candidateCellsByDigit;
    }

    canExecuteStep(step: SolutionStep): boolean {
        return StepType.HIDDEN_PAIR === step.type;
    }

    private buildSolutionStep(tuple: number[], foundIndices: number[], unitIndex: number): SolutionStep {
        const step = new HiddenPairSolutionStep();
        step.unit = unitIndex;
        step.tuple = tuple;
        const pair = new BitSet(NUM_DIGITS + 1);
        pair.set(tuple[0]);
        pair.set(tuple[1]);
        this.addDeletableCandidates(step, foundIndices[0], pair);
        this.addDeletableCandidates(step, foundIndices[1], pair);
        return step;
    }
}
