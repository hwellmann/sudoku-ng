import { getLogger, Logger } from "@log4js2/core";
import { Cell, DIGITS } from "./cell";
import { ALL_UNITS, Sudoku } from "./sudoku";

const INVALID = -1;

export class SingleSolver {
    private readonly log: Logger = getLogger("SingleSolver");

    setSingles(sudoku: Sudoku): void {
        let nakedSingles = true;
        let hiddenSingles = true;
        while (nakedSingles || hiddenSingles) {
            nakedSingles = this.setNakedSingles(sudoku);
            hiddenSingles = this.setHiddenSingles(sudoku);
        }
    }

    setNakedSingles(sudoku: Sudoku): boolean {
        let found = false;
        for (const cell of sudoku.cells) {
            const candidates = cell.candidates;
            if (candidates.getCardinality() === 1) {
                const candidate = candidates.nextSetBit(0);
                sudoku.setCell(cell.index, candidate);
                this.log.debug("naked single {} at {}", candidate, cell.index);
                found = true;
            }
        }
        return found;
    }

    setHiddenSingles(sudoku: Sudoku): boolean {
        let found = false;
        for (const indices of ALL_UNITS) {
            for (const digit of DIGITS) {
                const hiddenIndex = SingleSolver.findHiddenSingle(digit, indices, sudoku);
                if (hiddenIndex !== INVALID) {
                    sudoku.setCell(hiddenIndex, digit);
                    this.log.debug("hidden single {} at {}", digit, hiddenIndex);
                    found = true;
                }
            }
        }
        return found;
    }

    private static findHiddenSingle(digit: number, indices: number[], sudoku: Sudoku): number {
        let hiddenIndex = INVALID;
        for (const index of indices) {
            const cell: Cell = sudoku.getCell(index);
            if (cell.isCandidate(digit)) {
                if (hiddenIndex === INVALID) {
                    hiddenIndex = index;
                } else {
                    return INVALID;
                }
            }
        }
        return hiddenIndex;
    }
}
