import { getLogger, Logger } from '@log4js2/core';
import { NUM_DIGITS } from 'app/generator/cell';
import { ALL_UNITS, Sudoku } from 'app/generator/sudoku';
import BitSet from 'fast-bitset';
import { SolutionStep } from './solution-step';
import { Solver } from './solver';
import { StepType } from './step-type';

class NakedTripleSolutionStep extends SolutionStep {
    constructor() {
        super();
        this.type = StepType.NAKED_TRIPLE;
    }

    toString(): string {
        const it = this.insertableCandidates.entries();
        const [index1, candidates1] = it.next().value;
        const [index2, candidates2] = it.next().value;
        const [index3, candidates3] = it.next().value;
        const pos1 = Sudoku.getPosition(index1);
        const pos2 = Sudoku.getPosition(index2);
        const pos3 = Sudoku.getPosition(index3);
        let msg = `${this.type}: ${this.tuple} at ${pos1}, ${pos2} and ${pos3}`;
        this.deletableCandidates.forEach((candidates, index) => {
            if (!candidates.isEmpty()) {
                const pos = Sudoku.getPosition(index);
                msg += `, ${pos} != ${candidates.getIndices()}`;
            }
        });
        return msg;
    }
}

export class NakedTripleSolver extends Solver {
    private readonly log: Logger = getLogger('NakedTripleSolver');

    findStep(): SolutionStep {
        let unitIndex = 0;
        for (const indices of ALL_UNITS) {
            const step = this.findNakedTriple(indices, unitIndex);
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

    private findNakedTriple(indices: number[], unitIndex: number): SolutionStep {
        for (let i = 0; i < NUM_DIGITS; i++) {
            const index1 = indices[i];
            const candidates1 = this.sudoku.getCell(index1).candidates;
            if (1 <= candidates1.getCardinality() && candidates1.getCardinality() <= 3) {
                for (let j = i + 1; j < NUM_DIGITS; j++) {
                    const index2 = indices[j];
                    const candidates2 = this.sudoku.getCell(index2).candidates;
                    const jointCandidates = candidates1.or(candidates2);
                    if (1 <= candidates2.getCardinality() && jointCandidates.getCardinality() <= 3) {
                        for (let k = j + 1; k < NUM_DIGITS; k++) {
                            const index3 = indices[k];
                            const candidates3 = this.sudoku.getCell(index3).candidates;
                            const finalCandidates = jointCandidates.or(candidates3);
                            if (1 <= candidates3.getCardinality() && finalCandidates.getCardinality() === 3) {
                                const triple = [index1, index2, index3];
                                const deletableCandidates = this.findDeletableCandidates(indices, triple, finalCandidates);
                                if (deletableCandidates.size > 0) {
                                    return this.buildSolutionStep(finalCandidates.getIndices(), triple,
                                        unitIndex, finalCandidates, deletableCandidates);
                                }
                            }
                        }
                    }
                }
            }
        }
        return undefined;
    }

    private findDeletableCandidates(indices: number[], tripleIndices: number[], triple: BitSet): Map<number, BitSet> {
        const deletableCandidates = new Map<number, BitSet>();
        for (const index of indices) {
            if (!tripleIndices.includes(index)) {
                const deletable = this.sudoku.getCell(index).candidates.and(triple);
                if (!deletable.isEmpty()) {
                    deletableCandidates.set(index, deletable);
                }
            }
        }
        return deletableCandidates;
    }


    canExecuteStep(step: SolutionStep): boolean {
        return StepType.NAKED_TRIPLE === step.type;
    }

    private buildSolutionStep(
        tuple: number[], foundIndices: number[], unitIndex: number,
        triple: BitSet, deletableCandidates: Map<number, BitSet>): SolutionStep {

        const step = new NakedTripleSolutionStep();
        step.unit = unitIndex;
        step.tuple = tuple;
        foundIndices.forEach(index => step.insertableCandidates.set(index, triple));
        step.deletableCandidates = deletableCandidates;
        return step;
    }
}
