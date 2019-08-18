import { Component, ViewChild, ElementRef } from '@angular/core';
import { Sudoku } from 'app/generator/sudoku';
import { Cell } from 'app/generator/cell';
import { Logger, getLogger } from '@log4js2/core';

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

    @ViewChild('grid', { static: true })
    tableRef: ElementRef;

    private readonly log: Logger = getLogger('GridComponent');

    constructor(public app: GridApp) { }

    onKeyup(event: KeyboardEvent, row: number, col: number) {
        this.log.debug(`key ${event.key} in (${row}, ${col})`, event.key, row, col);
        this.tableRef.nativeElement.focus();
    }

    onTableKeyup(event: KeyboardEvent) {
        this.log.debug(`key ${event.key}`);
    }
}
