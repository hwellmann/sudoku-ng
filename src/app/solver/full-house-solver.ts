import { getLogger, Logger } from '@log4js2/core';
import { Cell, NUM_DIGITS } from 'app/generator/cell';
import { ALL_UNITS } from 'app/generator/sudoku';
import BitSet from 'fast-bitset';
import { SolutionStep } from './solution-step';
import { Solver } from './solver';
import { StepType } from './step-type';

export class FullHouseSolver extends Solver {
    private readonly log: Logger = getLogger('FullHouseSolver');

    findStep(): SolutionStep {
        let unitIndex = 0;
        for (const indices of ALL_UNITS) {
            const step = this.findFullHouse(unitIndex, indices);
            if (step !== undefined) {
                return step;
            }
            unitIndex++;
        }
        return undefined;
    }

    executeStep(step: SolutionStep): void {
        this.insertCandidates(step);
    }

    canExecuteStep(step: SolutionStep): boolean {
        return StepType.FULL_HOUSE === step.type;
    }

    private findFullHouse(unitIndex: number, indices: number[]): SolutionStep {
        const emptyCells = indices.map(index => this.sudoku.getCell(index)).filter(cell => cell.isEmpty());
        if (emptyCells.length === 1) {
            return this.buildSolutionStep(unitIndex, emptyCells[0]);
        } else {
            return undefined;
        }
    }

    private buildSolutionStep(unitIndex: number, emptyCell: Cell) {
        const step = new SolutionStep();
        step.type = StepType.FULL_HOUSE;
        step.unit = unitIndex;
        const candidate = emptyCell.candidates.nextSetBit(0);
        step.tuple.push(candidate);
        const candidates = new BitSet(NUM_DIGITS + 1);
        candidates.set(candidate);
        step.insertableCandidates.set(emptyCell.index, candidates);
        return step;
    }
}
