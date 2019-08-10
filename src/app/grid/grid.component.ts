import { Component } from '@angular/core';
import { Sudoku } from 'app/generator/sudoku';
import { Cell } from 'app/generator/cell';

export abstract class GridApp {
    sudoku: Sudoku;
    abstract fieldClicked(row: number, col: number): void;
    abstract getField(row: number, col: number): Cell;
}

@Component({
    selector: 'sudoku-grid',
    styleUrls: ['./grid.component.scss'],
    templateUrl: './grid.component.html',
})
export class GridComponent {

    constructor(public app: GridApp) { }

    fieldClicked(row: number, col: number): void {
        console.log(`clicked row ${row}, column ${col}`);
    }


}
