import { Component } from '@angular/core';
import { Sudoku } from 'app/generator/sudoku';
import { Cell } from 'app/generator/cell';

export interface FieldCssClass {
    field: boolean;
    initialClue: boolean;
    selectedPosition: boolean;
    lastSolvedField: boolean;
    groupForLastSolvedField: boolean;
    selectedDigit: boolean;
    onlyOnePossibleDigit: boolean;
}

export abstract class GridApp {
    sudoku: Sudoku;
    abstract fieldClicked(row: number, col: number): void;
    abstract getField(row: number, col: number): Cell;
    abstract fieldCssClass(row: number, col: number): FieldCssClass;
    abstract fieldCssClasses(row: number, col: number): string;
}

@Component({
    selector: 'sudoku-grid',
    styleUrls: ['./grid.component.scss'],
    templateUrl: './grid.component.html',
})
export class GridComponent {

     constructor(public app: GridApp) { }

}
