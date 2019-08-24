import { Cell, DIGITS, NUM_DIGITS } from 'app/generator/cell';
import { Position } from './position';

export const NUM_CELLS = NUM_DIGITS * NUM_DIGITS;

/// All indices for every row.
const ROWS: number[][] = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, 32, 33, 34, 35],
    [36, 37, 38, 39, 40, 41, 42, 43, 44],
    [45, 46, 47, 48, 49, 50, 51, 52, 53],
    [54, 55, 56, 57, 58, 59, 60, 61, 62],
    [63, 64, 65, 66, 67, 68, 69, 70, 71],
    [72, 73, 74, 75, 76, 77, 78, 79, 80],
];

/// All indices for every column.
const COLS: number[][] = [
    [0, 9, 18, 27, 36, 45, 54, 63, 72],
    [1, 10, 19, 28, 37, 46, 55, 64, 73],
    [2, 11, 20, 29, 38, 47, 56, 65, 74],
    [3, 12, 21, 30, 39, 48, 57, 66, 75],
    [4, 13, 22, 31, 40, 49, 58, 67, 76],
    [5, 14, 23, 32, 41, 50, 59, 68, 77],
    [6, 15, 24, 33, 42, 51, 60, 69, 78],
    [7, 16, 25, 34, 43, 52, 61, 70, 79],
    [8, 17, 26, 35, 44, 53, 62, 71, 80],
];

/// All indices for every block.
const BLOCKS: number[][] = [
    [0, 1, 2, 9, 10, 11, 18, 19, 20],
    [3, 4, 5, 12, 13, 14, 21, 22, 23],
    [6, 7, 8, 15, 16, 17, 24, 25, 26],
    [27, 28, 29, 36, 37, 38, 45, 46, 47],
    [30, 31, 32, 39, 40, 41, 48, 49, 50],
    [33, 34, 35, 42, 43, 44, 51, 52, 53],
    [54, 55, 56, 63, 64, 65, 72, 73, 74],
    [57, 58, 59, 66, 67, 68, 75, 76, 77],
    [60, 61, 62, 69, 70, 71, 78, 79, 80],
];

/// All indices for all units: first rows, then columns, then blocks.
export const ALL_UNITS: number[][] = [
    ROWS[0], ROWS[1], ROWS[2], ROWS[3], ROWS[4], ROWS[5], ROWS[6], ROWS[7], ROWS[8],
    COLS[0], COLS[1], COLS[2], COLS[3], COLS[4], COLS[5], COLS[6], COLS[7], COLS[8],
    BLOCKS[0], BLOCKS[1], BLOCKS[2], BLOCKS[3], BLOCKS[4], BLOCKS[5], BLOCKS[6], BLOCKS[7], BLOCKS[8],
];

/// The index in {@link #BLOCKS} for every cell (speeds up lookup).
const BLOCK_FROM_INDEX = [
    0, 0, 0, 1, 1, 1, 2, 2, 2,
    0, 0, 0, 1, 1, 1, 2, 2, 2,
    0, 0, 0, 1, 1, 1, 2, 2, 2,
    3, 3, 3, 4, 4, 4, 5, 5, 5,
    3, 3, 3, 4, 4, 4, 5, 5, 5,
    3, 3, 3, 4, 4, 4, 5, 5, 5,
    6, 6, 6, 7, 7, 7, 8, 8, 8,
    6, 6, 6, 7, 7, 7, 8, 8, 8,
    6, 6, 6, 7, 7, 7, 8, 8, 8,
];

const BUDDIES: number[][] = [];

export function buddies(index: number): number[] {
    return BUDDIES[index];
}


export interface SolvedSudoku {
    puzzle: string;
    solution: string;
}

export class Sudoku {

    readonly cells: Cell[] = [];
    private numSolved = 0;

    constructor(other?: Sudoku) {
        if (other === undefined) {
            for (let index = 0; index < NUM_CELLS; index++) {
                this.cells.push(new Cell(index));
            }
        } else {
            other.cells.forEach(cell => this.cells.push(new Cell(cell)));
            this.numSolved = other.numSolved;
        }
    }

    static getRow(index: number): number {
        return Math.floor(index / NUM_DIGITS);
    }

    static getColumn(index: number): number {
        return index % NUM_DIGITS;
    }

    static getBlock(index: number): number {
        return BLOCK_FROM_INDEX[index];
    }

    static getPosition(index: number): Position {
        return new Position(1 + Sudoku.getRow(index), 1 + Sudoku.getColumn(index));
    }

    static fromString(s: string): Sudoku {
        if (s.length !== NUM_CELLS) {
            throw new Error(`length must be ${NUM_CELLS}`);
        }
        const sudoku = new Sudoku();
        for (let pos = 0; pos < NUM_CELLS; pos++) {
            const value = Sudoku.extractValue(s, pos);
            if (value > 0) {
                sudoku.setCell(pos, value);
                sudoku.cells[pos].given = true;
            }
        }
        return sudoku;
    }

    static fromSolvedSudoku(solved: SolvedSudoku): Sudoku {
        const sudoku = Sudoku.fromString(solved.puzzle);
        for (let pos = 0; pos < NUM_CELLS; pos++) {
            const solution = Number(solved.solution.charAt(pos));
            sudoku.cells[pos].solution = solution;
        }
        return sudoku;
    }

    private static extractValue(s: string, pos: number): number {
        const c = s.charAt(pos);
        if (c === '.') {
            return 0;
        }
        return Number(c);
    }

    asString(): string {
        return this.cells.map(cell => cell.asString())
            .join('');
    }

    get solutionAsString(): string {
        return this.cells.map(cell => cell.solution)
            .join('');
    }

    asSolvedSudoku(): SolvedSudoku {
        return {
            puzzle: this.asString(),
            solution: this.solutionAsString
        };
    }

    setCell(index: number, value: number): void {
        const cell: Cell = this.cells[index];
        if (cell.isFilled()) {
            throw new Error('cell is already filled');
        }

        if (!cell.isCandidate(value)) {
            throw new Error('not a valid candidate');
        }
        cell.value = value;
        this.numSolved++;

        buddies(index)
            .forEach(pos => this.cells[pos].removeCandidate(value));
    }

    getCell(index: number): Cell {
        return this.cells[index];
    }

    clearCell(index: number): void {
        const cell: Cell = this.cells[index];
        if (!cell.isFilled()) {
            throw new Error('Cell is not filled');
        }
        cell.clear();
        this.numSolved--;
        buddies(index)
            .forEach(pos => this.computeCandidates(pos));
    }

    private computeCandidates(index: number): void {
        const cell = this.cells[index];
        if (cell.isFilled()) {
            return;
        }

        cell.clear();

        DIGITS.forEach(digit => {
            if (this.canSee(index, digit)) {
                cell.removeCandidate(digit);
            }
        });
    }

    private canSee(index: number, digit: number): boolean {
        return buddies(index)
            .some(pos => this.cells[pos].value === digit);
    }

    isSolved(): boolean {
        return this.numSolved === NUM_CELLS;
    }

    isUnsolvable(): boolean {
        return this.hasUnsatisfiableCells() || this.hasUnsatisfiableUnits();
    }

    private hasUnsatisfiableCells(): boolean {
        return this.cells.some(cell => cell.isUnsatisfiable());
    }

    private hasUnsatisfiableUnits(): boolean {
        for (const indices of ALL_UNITS) {
            for (const digit of DIGITS) {
                if (this.hasNoCandidatesInUnit(digit, indices)) {
                    return true;
                }
            }
        }
        return false;
    }

    private hasNoCandidatesInUnit(digit: number, indices: number[]): boolean {
        for (const index of indices) {
            const cell = this.cells[index];
            if (cell.value === digit || cell.isCandidate(digit)) {
                return false;
            }
        }
        return true;
    }

    isExhausted(digit: number): boolean {
        const numSetDigits = this.cells
            .filter(cell => cell.value === digit)
            .length;
        return numSetDigits === NUM_DIGITS;
    }
}

function initBuddies(): void {
    for (let pos = 0; pos < NUM_CELLS; pos++) {
        BUDDIES.push(ROWS[Sudoku.getRow(pos)]
            .concat(COLS[Sudoku.getColumn(pos)])
            .concat(BLOCKS[Sudoku.getBlock(pos)]));
    }
}

initBuddies();
