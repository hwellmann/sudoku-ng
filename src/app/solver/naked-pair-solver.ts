import { getLogger, Logger } from '@log4js2/core';
import { NUM_DIGITS } from 'app/generator/cell';
import { ALL_UNITS, Sudoku } from 'app/generator/sudoku';
import BitSet from 'fast-bitset';
import { SolutionStep } from './solution-step';
import { Solver } from './solver';
import { StepType } from './step-type';

class NakedPairSolutionStep extends SolutionStep {
    constructor() {
        super();
        this.type = StepType.NAKED_PAIR;
    }

    toString(): string {
        const it = this.insertableCandidates.entries();
        const [index1, candidates1] = it.next().value;
        const [index2, candidates2] = it.next().value;
        const pos1 = Sudoku.getPosition(index1);
        const pos2 = Sudoku.getPosition(index2);
        let msg = `${this.type}: ${this.tuple} at ${pos1} and ${pos2}`;
        this.deletableCandidates.forEach((candidates, index) => {
            if (!candidates.isEmpty()) {
                const pos = Sudoku.getPosition(index);
                msg += `, ${pos} != ${candidates.getIndices()}`;
            }
        });
        return msg;
    }
}

export class NakedPairSolver extends Solver {
    private readonly log: Logger = getLogger('NakedPairSolver');

    findStep(): SolutionStep {
        let unitIndex = 0;
        for (const indices of ALL_UNITS) {
            const step = this.findNakedPair(indices, unitIndex);
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

    private findNakedPair(indices: number[], unitIndex: number): SolutionStep {
        for (let i = 0; i < NUM_DIGITS; i++) {
            const index1 = indices[i];
            const candidates1 = this.sudoku.getCell(index1).candidates;
            if (candidates1.getCardinality() === 2) {
                for (let j = i + 1; j < NUM_DIGITS; j++) {
                    const index2 = indices[j];
                    const candidates2 = this.sudoku.getCell(index2).candidates;
                    if (candidates1.isEqual(candidates2)) {
                        const deletableCandidates = this.findDeletableCandidates(indices, [index1, index2], candidates1);
                        if (deletableCandidates.size > 0) {
                            return this.buildSolutionStep(candidates1.getIndices(), [index1, index2],
                                unitIndex, candidates1, deletableCandidates);
                        }
                    }
                }
            }
        }
        return undefined;
    }

    private findDeletableCandidates(indices: number[], pairIndices: number[], pair: BitSet): Map<number, BitSet> {
        const deletableCandidates = new Map<number, BitSet>();
        for (const index of indices) {
            if (!pairIndices.includes(index)) {
                const deletable = this.sudoku.getCell(index).candidates.and(pair);
                if (!deletable.isEmpty()) {
                    deletableCandidates.set(index, deletable);
                }
            }
        }
        return deletableCandidates;
    }


    canExecuteStep(step: SolutionStep): boolean {
        return StepType.NAKED_PAIR === step.type;
    }

    private buildSolutionStep(
        tuple: number[], foundIndices: number[], unitIndex: number,
        pair: BitSet, deletableCandidates: Map<number, BitSet>): SolutionStep {

        const step = new NakedPairSolutionStep();
        step.unit = unitIndex;
        step.tuple = tuple;
        foundIndices.forEach(index => step.insertableCandidates.set(index, pair));
        step.deletableCandidates = deletableCandidates;
        return step;
    }
}
