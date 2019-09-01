import { getLogger, Logger } from '@log4js2/core';
import { DIGITS, NUM_DIGITS } from 'app/generator/cell';
import { ALL_UNITS, NUM_CELLS, Sudoku } from 'app/generator/sudoku';
import BitSet from 'fast-bitset';
import { SolutionStep } from './solution-step';
import { Solver } from './solver';
import { StepType } from './step-type';

class HiddenQuadrupleSolutionStep extends SolutionStep {
    constructor() {
        super();
        this.type = StepType.HIDDEN_QUADRUPLE;
    }

    toString(): string {
        const it = this.deletableCandidates.entries();
        const [index1, candidates1] = it.next().value;
        const [index2, candidates2] = it.next().value;
        const [index3, candidates3] = it.next().value;
        const [index4, candidates4] = it.next().value;
        const pos1 = Sudoku.getPosition(index1);
        const pos2 = Sudoku.getPosition(index2);
        const pos3 = Sudoku.getPosition(index3);
        const pos4 = Sudoku.getPosition(index4);
        let msg = `${this.type}: ${this.tuple} at ${pos1}, ${pos2}, ${pos3} and ${pos4}`;
        if (!candidates1.isEmpty()) {
            msg += `, ${pos1} != ${candidates1.getIndices()}`;
        }
        if (!candidates2.isEmpty()) {
            msg += `, ${pos2} != ${candidates2.getIndices()}`;
        }
        if (!candidates3.isEmpty()) {
            msg += `, ${pos3} != ${candidates3.getIndices()}`;
        }
        if (!candidates4.isEmpty()) {
            msg += `, ${pos4} != ${candidates4.getIndices()}`;
        }
        return msg;
    }

    addDeletableCandidates(index: number, deletable: BitSet) {

    }
}

export class HiddenQuadrupleSolver extends Solver {
    private readonly log: Logger = getLogger('HiddenQuadrupleSolver');

    findStep(): SolutionStep {
        let unitIndex = 0;
        for (const indices of ALL_UNITS) {
            const step = this.findHiddenQuadruple(indices, unitIndex);
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

    private findHiddenQuadruple(indices: number[], unitIndex: number): SolutionStep {
        this.log.debug('searching unit {}', Sudoku.getUnitName(unitIndex));
        const candidateCellsByDigit = this.buildCandidateCellsByDigit(indices);

        for (const first of DIGITS) {
            const firstCandidates = candidateCellsByDigit[first];
            if (1 <= firstCandidates.getCardinality() && firstCandidates.getCardinality() <= 4) {
                for (let second = first + 1; second <= NUM_DIGITS; second++) {
                    const secondCandidates = candidateCellsByDigit[second];
                    const jointCandidates = firstCandidates.or(secondCandidates);
                    if (1 <= secondCandidates.getCardinality() && secondCandidates.getCardinality() <= 4
                        && jointCandidates.getCardinality() <= 4) {
                        for (let third = second + 1; third <= NUM_DIGITS; third++) {
                            const thirdCandidates = candidateCellsByDigit[third];
                            const intermediateCandidates = jointCandidates.or(thirdCandidates);
                            if (1 <= thirdCandidates.getCardinality() && thirdCandidates.getCardinality() <= 4
                                && intermediateCandidates.getCardinality() <= 4) {
                                for (let fourth = third + 1; fourth <= NUM_DIGITS; fourth++) {
                                    const fourthCandidates = candidateCellsByDigit[fourth];
                                    const finalCandidates = intermediateCandidates.or(fourthCandidates);
                                    if (1 <= fourthCandidates.getCardinality() && fourthCandidates.getCardinality() <= 4
                                        && finalCandidates.getCardinality() === 4) {
                                        const foundIndices = finalCandidates.getIndices();
                                        if (this.checkAdditionalCandidates(foundIndices)) {
                                            return this.buildSolutionStep([first, second, third, fourth], foundIndices, unitIndex);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private checkAdditionalCandidates(pairIndices: number[]) {
        return pairIndices.find(index => this.sudoku.getCell(index).candidates.getCardinality() > 4) !== undefined;
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
        return StepType.HIDDEN_QUADRUPLE === step.type;
    }

    private buildSolutionStep(tuple: number[], foundIndices: number[], unitIndex: number): SolutionStep {
        const step = new HiddenQuadrupleSolutionStep();
        step.unit = unitIndex;
        step.tuple = tuple;
        const quadruple = new BitSet(NUM_DIGITS + 1);
        quadruple.set(tuple[0]);
        quadruple.set(tuple[1]);
        quadruple.set(tuple[2]);
        quadruple.set(tuple[3]);
        this.addDeletableCandidates(step, foundIndices[0], quadruple);
        this.addDeletableCandidates(step, foundIndices[1], quadruple);
        this.addDeletableCandidates(step, foundIndices[2], quadruple);
        this.addDeletableCandidates(step, foundIndices[3], quadruple);
        return step;
    }
}
