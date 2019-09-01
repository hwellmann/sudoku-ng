import { getLogger, Logger } from '@log4js2/core';
import { NUM_DIGITS } from 'app/generator/cell';
import { ALL_UNITS, Sudoku } from 'app/generator/sudoku';
import BitSet from 'fast-bitset';
import { SolutionStep } from './solution-step';
import { Solver } from './solver';
import { StepType } from './step-type';

class NakedQuadrupleSolutionStep extends SolutionStep {
    constructor() {
        super();
        this.type = StepType.NAKED_QUADRUPLE;
    }

    toString(): string {
        const it = this.insertableCandidates.entries();
        const [index1, ] = it.next().value;
        const [index2, ] = it.next().value;
        const [index3, ] = it.next().value;
        const [index4, ] = it.next().value;
        const pos1 = Sudoku.getPosition(index1);
        const pos2 = Sudoku.getPosition(index2);
        const pos3 = Sudoku.getPosition(index3);
        const pos4 = Sudoku.getPosition(index4);
        let msg = `${this.type}: ${this.tuple} at ${pos1}, ${pos2}, ${pos3} and ${pos4}`;
        this.deletableCandidates.forEach((candidates, index) => {
            if (!candidates.isEmpty()) {
                const pos = Sudoku.getPosition(index);
                msg += `, ${pos} != ${candidates.getIndices()}`;
            }
        });
        return msg;
    }
}

export class NakedQuadrupleSolver extends Solver {
    private readonly log: Logger = getLogger('NakedQuadrupleSolver');

    findStep(): SolutionStep {
        let unitIndex = 0;
        for (const indices of ALL_UNITS) {
            const step = this.findNakedQuadruple(indices, unitIndex);
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

    private findNakedQuadruple(indices: number[], unitIndex: number): SolutionStep {
        for (let i = 0; i < NUM_DIGITS; i++) {
            const index1 = indices[i];
            const candidates1 = this.sudoku.getCell(index1).candidates;
            if (1 <= candidates1.getCardinality() && candidates1.getCardinality() <= 4) {
                for (let j = i + 1; j < NUM_DIGITS; j++) {
                    const index2 = indices[j];
                    const candidates2 = this.sudoku.getCell(index2).candidates;
                    const jointCandidates = candidates1.or(candidates2);
                    if (1 <= candidates2.getCardinality() && jointCandidates.getCardinality() <= 4) {
                        for (let k = j + 1; k < NUM_DIGITS; k++) {
                            const index3 = indices[k];
                            const candidates3 = this.sudoku.getCell(index3).candidates;
                            const intermediateCandidates = jointCandidates.or(candidates3);
                            if (1 <= candidates3.getCardinality() && intermediateCandidates.getCardinality() <= 4) {
                                for (let m = k + 1; m < NUM_DIGITS; m++) {
                                    const index4 = indices[m];
                                    const candidates4 = this.sudoku.getCell(index4).candidates;
                                    const finalCandidates = intermediateCandidates.or(candidates4);
                                    if (1 <= candidates4.getCardinality() && finalCandidates.getCardinality() === 4) {
                                        const quadruple = [index1, index2, index3, index4];
                                        const deletableCandidates = this.findDeletableCandidates(indices, quadruple, finalCandidates);
                                        if (deletableCandidates.size > 0) {
                                            return this.buildSolutionStep(finalCandidates.getIndices(), quadruple,
                                                unitIndex, finalCandidates, deletableCandidates);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return undefined;
    }

    private findDeletableCandidates(indices: number[], quadrupleIndices: number[], quadruple: BitSet): Map<number, BitSet> {
        const deletableCandidates = new Map<number, BitSet>();
        for (const index of indices) {
            if (!quadrupleIndices.includes(index)) {
                const deletable = this.sudoku.getCell(index).candidates.and(quadruple);
                if (!deletable.isEmpty()) {
                    deletableCandidates.set(index, deletable);
                }
            }
        }
        return deletableCandidates;
    }


    canExecuteStep(step: SolutionStep): boolean {
        return StepType.NAKED_QUADRUPLE === step.type;
    }

    private buildSolutionStep(
        tuple: number[], foundIndices: number[], unitIndex: number,
        quadruple: BitSet, deletableCandidates: Map<number, BitSet>): SolutionStep {

        const step = new NakedQuadrupleSolutionStep();
        step.unit = unitIndex;
        step.tuple = tuple;
        foundIndices.forEach(index => step.insertableCandidates.set(index, quadruple));
        step.deletableCandidates = deletableCandidates;
        return step;
    }
}
