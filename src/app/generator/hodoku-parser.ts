import { Sudoku } from './sudoku';
import { NUM_DIGITS, Cell } from './cell';

export class HodokuCandidatesParser {
    private numLines = 0;
    private index = 0;
    private sudoku: Sudoku;

    parse(text: string): Sudoku {
        this.sudoku = new Sudoku();
        const lines = text.split('\n');
        lines.filter(line => line.startsWith('|')).forEach(line => this.parseLine(line));
        return this.sudoku;
    }

    private parseLine(line: string): void {
        const line2 = line.replace(/\|/g, ' ').trim();
        const parts = line2.split(/[\s]+/);
        if (this.numLines < NUM_DIGITS) {
            this.addGivens(parts);
        } else if (this.numLines < 2 * NUM_DIGITS) {
            this.fillCells(parts);
        } else {
            this.setCandidates(parts);
        }
        this.numLines++;

        if (this.numLines === NUM_DIGITS || this.numLines === 2 * NUM_DIGITS) {
            this.index = 0;
        }
    }

    private addGivens(parts: string[]) {
        this.assertParts(parts);
        for (const part of parts) {
            if (part !== '.') {
                const digit = Number(part);
                this.sudoku.setCell(this.index, digit);
                this.sudoku.getCell(this.index).given = true;
            }
            this.index++;
        }
    }


    private fillCells(parts: string[]) {
        this.assertParts(parts);
        for (const part of parts) {
            if (part !== '.') {
                const digit = Number(part);
                if (!this.sudoku.getCell(this.index).given) {
                    this.sudoku.setCell(this.index, digit);
                }
            }
            this.index++;
        }
    }

    private setCandidates(parts: string[]) {
        this.assertParts(parts);
        for (const part of parts) {
            const cell = this.sudoku.getCell(this.index);
            if (cell.isEmpty()) {
                this.setCellCandidates(cell, part);
            }
            this.index++;
        }
    }

    private setCellCandidates(cell: Cell, part: string) {
        cell.candidates.clear();
        for (const c of part) {
            const digit = Number(c);
            cell.addCandidate(digit);
        }
    }

    private assertParts(parts: string[]) {
        if (parts.length !== NUM_DIGITS) {
            throw new Error('expected 9 cells per line');
        }

        if (this.numLines < 2 * NUM_DIGITS) {
            parts.forEach(part => this.assertCell(part));
        } else {
            parts.forEach(part => this.assertCandidates(part));
        }
    }

    private assertCell(part: string): void {
        if (part.length !== 1) {
            throw new Error('part must be a single character, got: ' + part);
        }
        if (! '.123456789'.includes(part)) {
            throw new Error('expected: one of \'.123456789\', actual: ' + part);
        }
    }

    private assertCandidates(part: string): void {
        if (!part.match('[1-9]{1,9}')) {
            throw new Error('expected: up to 9 digits, actual: ' + part);
        }
    }
}
