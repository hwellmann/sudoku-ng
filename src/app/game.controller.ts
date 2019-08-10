import { Injectable } from '@angular/core';
import { SidenavApp } from './sidenav/sidenav.component';
import { GridApp } from './grid/grid.component';
import { Sudoku } from './generator/sudoku';
import { Logger, getLogger } from '@log4js2/core';
import { BacktrackingGenerator } from './generator/backtracking-generator';
import { Cell, NUM_DIGITS } from './generator/cell';

@Injectable()
export class GameController implements SidenavApp, GridApp {
    sudoku: Sudoku = new Sudoku();

    private generator: BacktrackingGenerator = new BacktrackingGenerator();

    private readonly log: Logger = getLogger('BacktrackingGenerator');


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
        console.log(`clicked row ${row}, column ${col}`);
    }

    getField(row: number, col: number): Cell {
        const index = (row - 1) * NUM_DIGITS + (col - 1);
        return this.sudoku.getCell(index);
    }


}
