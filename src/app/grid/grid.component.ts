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
    abstract readonly isUserDefined: boolean;
    abstract readonly grid: number[][];
    abstract readonly fieldCssClasses: FieldCssClass[][];
    abstract readonly fieldStates: number[][];

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
