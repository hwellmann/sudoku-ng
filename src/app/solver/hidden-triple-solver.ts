import { getLogger, Logger } from '@log4js2/core';
import { Cell, DIGITS, NUM_DIGITS } from 'app/generator/cell';
import { ALL_UNITS, Sudoku, NUM_CELLS } from 'app/generator/sudoku';
import BitSet from 'fast-bitset';
import { SolutionStep } from './solution-step';
import { Solver } from './solver';
import { StepType } from './step-type';

class HiddenTripleSolutionStep extends SolutionStep {
    constructor() {
        super();
        this.type = StepType.HIDDEN_TRIPLE;
    }

    toString(): string {
        const it = this.deletableCandidates.entries();
        const [index1, candidates1] = it.next().value;
        const [index2, candidates2] = it.next().value;
        const [index3, candidates3] = it.next().value;
        const pos1 = Sudoku.getPosition(index1);
        const pos2 = Sudoku.getPosition(index2);
        const pos3 = Sudoku.getPosition(index3);
        let msg = `${this.type}: ${this.tuple} at ${pos1}, ${pos2} and ${pos3}`;
        if (!candidates1.isEmpty()) {
            msg += `, ${pos1} != ${candidates1.getIndices()}`;
        }
        if (!candidates2.isEmpty()) {
            msg += `, ${pos2} != ${candidates2.getIndices()}`;
        }
        if (!candidates3.isEmpty()) {
            msg += `, ${pos3} != ${candidates3.getIndices()}`;
        }
        return msg;
    }
}

export class HiddenTripleSolver extends Solver {
    private readonly log: Logger = getLogger('HiddenTripleSolver');

    findStep(): SolutionStep {
        let unitIndex = 0;
        for (const indices of ALL_UNITS) {
            const step = this.findHiddenTriple(indices, unitIndex);
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

    private findHiddenTriple(indices: number[], unitIndex: number): SolutionStep {
        this.log.debug('searching unit {}', Sudoku.getUnitName(unitIndex));
        const candidateCellsByDigit = this.buildCandidateCellsByDigit(indices);

        for (const first of DIGITS) {
            const firstCandidates = candidateCellsByDigit[first];
            if (1 <= firstCandidates.getCardinality() && firstCandidates.getCardinality() <= 3) {
                for (let second = first + 1; second <= NUM_DIGITS; second++) {
                    const secondCandidates = candidateCellsByDigit[second];
                    let jointCandidates = firstCandidates.or(secondCandidates);
                    if (1 <= secondCandidates.getCardinality() && secondCandidates.getCardinality() <= 3 
                        && jointCandidates.getCardinality() <= 3) {
                        for (let third = second + 1; third <= NUM_DIGITS; third++) {
                            const thirdCandidates = candidateCellsByDigit[third];
                            jointCandidates = jointCandidates.or(thirdCandidates);
                            if (1 <= thirdCandidates.getCardinality() && thirdCandidates.getCardinality() <= 3 
                                && jointCandidates.getCardinality() === 3) {
                                const foundIndices = jointCandidates.getIndices();
                                if (this.checkAdditionalCandidates(foundIndices)) {
                                    return this.buildSolutionStep([first, second, third], foundIndices, unitIndex);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private checkAdditionalCandidates(pairIndices: number[]) {
        return pairIndices.find(index => this.sudoku.getCell(index).candidates.getCardinality() > 3) !== undefined;
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
        return StepType.HIDDEN_TRIPLE === step.type;
    }

    private buildSolutionStep(tuple: number[], foundIndices: number[], unitIndex: number): SolutionStep {
        const step = new HiddenTripleSolutionStep();
        step.unit = unitIndex;
        step.tuple = tuple;
        const triple = new BitSet(NUM_DIGITS + 1);
        triple.set(tuple[0]);
        triple.set(tuple[1]);
        triple.set(tuple[2]);
        this.addDeletableCandidates(step, foundIndices[0], triple);
        this.addDeletableCandidates(step, foundIndices[1], triple);
        this.addDeletableCandidates(step, foundIndices[2], triple);
        return step;
    }

    private addDeletableCandidates(step: HiddenTripleSolutionStep, index: number, triple: BitSet): void {
        const diff = this.sudoku.getCell(index).candidates.xor(triple);
        step.deletableCandidates.set(index, diff);
    }
}
