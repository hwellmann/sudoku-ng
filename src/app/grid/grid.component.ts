import { Component } from '@angular/core';

export interface FieldCssClass {
    initialClue: boolean;
    selectedPosition: boolean;
    lastSolvedField: boolean;
    groupForLastSolvedField: boolean;
    selectedDigit: boolean;
    onlyOnePossibleDigit: boolean;
}

export abstract class GridApp {
    abstract fieldClicked(row: number, col: number): void;
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
