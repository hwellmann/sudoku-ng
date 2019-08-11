import { getLogger, Logger } from '@log4js2/core';
import { Cell, NUM_DIGITS } from './cell';
import { SingleSolver } from './single-solver';
import { Sudoku } from './sudoku';

export class BacktrackingSolver {
    private readonly log: Logger = getLogger('BacktrackingSolver');
    private readonly singleSolver = new SingleSolver();
    private readonly solutions = new Set<string>();

    private static findIndexWithMinimumCandidate(sudoku: Sudoku): number {
        let minCandidates = NUM_DIGITS + 1;
        let minIndex = -1;
        for (const cell of sudoku.cells) {
            const index = cell.index;
            if (cell.isEmpty()) {
                const numCandidates = cell.candidates.getCardinality();
                if (numCandidates < minCandidates) {
                    minIndex = index;
                    minCandidates = numCandidates;
                }
            }
        }
        return minIndex;
    }

    solve(sudoku: Sudoku): Sudoku[] {
        this.solutions.clear();
        this.solveRecursively(sudoku);
        const result: Sudoku[] = [];
        this.solutions.forEach(s => result.push(Sudoku.fromString(s)));
        return result;
    }

    private solveRecursively(sudoku: Sudoku): void {
        const index = BacktrackingSolver.findIndexWithMinimumCandidate(sudoku);
        const cell: Cell = sudoku.getCell(index);
        for (const candidate of cell.candidates.getIndices()) {
            this.log.debug('trying {} at index {}', candidate, index);
            const nextSudoku = new Sudoku(sudoku);
            nextSudoku.setCell(index, candidate);
            this.singleSolver.setSingles(nextSudoku);
            if (nextSudoku.isSolved()) {
                this.solutions.add(nextSudoku.asString());
            } else if (!nextSudoku.isUnsolvable()) {
                this.solveRecursively(nextSudoku);
                if (this.solutions.size > 1) {
                    return;
                }
            }
        }
    }
}
