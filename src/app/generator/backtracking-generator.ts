import { getLogger, Logger } from '@log4js2/core';
import { BacktrackingSolver } from './backtracking-solver';
import { Cell } from './cell';
import { SingleSolver } from './single-solver';
import { Sudoku } from './sudoku';

type Optional<T> = T | null;

function shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]];
    }
}

function newShuffledIndices(): number[] {
    const indices = Array.from({ length: 81 }, (_, i) => i);
    shuffle(indices);
    return indices;
}

const MAX_TRIES = 100;

export class BacktrackingGenerator {

    private readonly log: Logger = getLogger('BacktrackingGenerator');
    private readonly solver: BacktrackingSolver = new BacktrackingSolver();
    private readonly singleSolver: SingleSolver = new SingleSolver();
    private numTries = 0;
    private indices: number[] = [];

    private static findFirstUnfilledIndex(sudoku: Sudoku, indices: number[]): number {
        const empty = indices.find(pos => sudoku.getCell(pos)
            .isEmpty());
        if (empty === undefined) {
            throw new Error('no unused index');
        }
        return empty;
    }

    generatePuzzle(): Sudoku {
        const solution: Sudoku = this.generateSolution();
        return this.createPuzzle(solution);
    }

    generateSolution(): Sudoku {
        let sudoku: Optional<Sudoku> = null;
        while (sudoku === null) {
            sudoku = this.tryGenerateSolution();
            this.log.debug('Failed to generates solution, retrying');
        }
        return sudoku;
    }

    createPuzzle(sudoku: Sudoku): Sudoku {
        if (!sudoku.isSolved()) {
            throw new Error('Sudoku is unsolved');
        }
        const puzzle = new Sudoku(sudoku);
        for (const index of newShuffledIndices()) {
            const digit = puzzle.getCell(index).value;
            puzzle.clearCell(index);
            if (!this.hasUniqueSolution(puzzle)) {
                puzzle.setCell(index, digit);
            }
        }
        for (const solutionCell of sudoku.cells) {
            const cell = puzzle.getCell(solutionCell.index);
            cell.solution = solutionCell.value;
            if (cell.value) {
                cell.given = true;
            }
        }
        return puzzle;
    }

    generateRecursively(sudoku: Sudoku): Optional<Sudoku> {
        const index = BacktrackingGenerator.findFirstUnfilledIndex(sudoku, this.indices);
        const cell: Cell = sudoku.getCell(index);
        for (const candidate of cell.candidates.getIndices()) {
            this.numTries++;
            if (this.numTries >= MAX_TRIES) {
                return null;
            }
            const solution = this.tryCandidate(sudoku, index, candidate);
            if (solution !== null) {
                return solution;
            }
        }
        return null;
    }

    private tryCandidate(sudoku: Sudoku, index: number, candidate: number): Optional<Sudoku> {
        this.log.debug('grid[{}] = {}, {}', index, candidate, sudoku.asString());
        const nextSudoku = new Sudoku(sudoku);
        nextSudoku.setCell(index, candidate);
        this.singleSolver.setSingles(nextSudoku);
        if (nextSudoku.isSolved()) {
            return nextSudoku;
        }

        if (nextSudoku.isUnsolvable()) {
            return null;
        }
        return this.generateRecursively(nextSudoku);
    }

    private tryGenerateSolution(): Optional<Sudoku> {
        this.indices = newShuffledIndices();
        this.numTries = 0;
        const emptySudoku = new Sudoku();
        return this.generateRecursively(emptySudoku);
    }

    hasUniqueSolution(sudoku: Sudoku): boolean {
        return this.solver.solve(sudoku).length === 1;
    }
}
