import { Injectable } from '@angular/core';
import { SidenavApp } from './sidenav/sidenav.component';
import { GridApp } from './grid/grid.component';
import { Sudoku } from './generator/sudoku';
import { Logger, getLogger } from '@log4js2/core';
import { BacktrackingGenerator } from './generator/backtracking-generator';
import { Cell, NUM_DIGITS } from './generator/cell';
import { DigitApp, DigitCssClass } from './digit/digit.component';

@Injectable()
export class GameController implements SidenavApp, GridApp, DigitApp {
    isUserDefined: boolean;
    sudoku: Sudoku = new Sudoku();

    private generator: BacktrackingGenerator = new BacktrackingGenerator();

    private readonly log: Logger = getLogger('BacktrackingGenerator');

    private selectedDigit: number;


    newGame(): void {
        this.log.info('new game');
        this.sudoku = this.generator.generatePuzzle();
    }

    ownGame(): void {
        this.log.info('own game');

    }

    about(): void {
        this.log.info('about game');
    }

    fieldClicked(row: number, col: number): void {
        this.log.info(`clicked row ${row}, column ${col}`);
        const cell: Cell = this.getField(row, col);
        if (this.selectedDigit === undefined) {
            return;
        }
        if (cell.isCandidate(this.selectedDigit) && cell.solution === this.selectedDigit) {
            this.sudoku.setCell(cell.index, this.selectedDigit);
        }
    }

    getField(row: number, col: number): Cell {
        const index = (row - 1) * NUM_DIGITS + (col - 1);
        return this.sudoku.getCell(index);
    }

    digitClicked(value: number): void {
        this.selectedDigit = value;
        this.log.info('selected digit {}', value);
    }

    digitCssClass(value: number): DigitCssClass {
        return {
            exhaustedDigit: this.sudoku.isExhausted(value),
            selectedDigit: value === this.selectedDigit
        };
    }

}
