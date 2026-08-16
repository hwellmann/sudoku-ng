import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Logger, getLogger } from '@log4js2/core';
import { CandidatesComponent } from '../candidates/candidates.component';
import { Cell, NUM_DIGITS } from '../generator/cell';
import { Sudoku } from '../generator/sudoku';

export interface FieldCssClass {
    field: boolean;
    initialClue: boolean;
    selectedPosition: boolean;
    selectedDigitCandidate: boolean;
    selectedDigit: boolean;
    onlyOnePossibleDigit: boolean;
}

export interface CandidateEvent {
    cell: Cell;
    candidate: number;
}

@Component({
    selector: 'sudoku-grid',
    standalone: true,
    imports: [CommonModule, MatButtonModule, CandidatesComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './grid.component.html',
})
export class GridComponent {

    @Input()
    sudoku: Sudoku;

    @Input()
    selectedDigit: number;

    @Input()
    selectedCell: Cell;

    @Input()
    enterGameMode = false;

    @Output() readonly fieldClicked = new EventEmitter<Cell>();
    @Output() readonly candidateClicked = new EventEmitter<CandidateEvent>();
    @Output() readonly candidateRightClicked = new EventEmitter<CandidateEvent>();

    @ViewChild('grid', { static: true })
    tableRef: ElementRef;

    private readonly log: Logger = getLogger('GridComponent');

    getField(row: number, col: number): Cell {
        const index = (row - 1) * NUM_DIGITS + (col - 1);
        return this.sudoku.getCell(index);
    }

    fieldCssClass(cell: Cell): FieldCssClass {
        return {
            field: true,
            initialClue: cell.given,
            selectedDigitCandidate: this.isSelectedDigitCandidate(cell),
            onlyOnePossibleDigit: cell.candidates.getCardinality() === 1,
            selectedDigit: this.selectedDigit === cell.value,
            selectedPosition: this.isSelectedPosition(cell)
        };
    }

    fieldCssClasses(cell: Cell): string {
        const classes: string[] = [];
        if (cell.candidates.getCardinality() === 1) {
            classes.push('onlyOnePossibleDigit');
        }
        if (this.selectedDigit === cell.value) {
            classes.push('selectedDigit');
        }
        if (this.isSelectedPosition(cell)) {
            classes.push('selectedPosition');
        }
        if (this.isSelectedDigitCandidate(cell)) {
            classes.push('selectedDigitCandidate');
        }
        return classes.join(' ');
    }

    private isSelectedDigitCandidate(cell: Cell): boolean {
        return !!this.selectedDigit && !this.enterGameMode && cell.isCandidate(this.selectedDigit);
    }

    private isSelectedPosition(cell: Cell): boolean {
        return !!this.selectedCell && this.selectedCell.index === cell.index;
    }

    onFieldClicked(cell: Cell): void {
        this.fieldClicked.emit(cell);
    }

    onCandidateClicked(cell: Cell, candidate: number): void {
        this.candidateClicked.emit({ cell, candidate });
    }

    onCandidateRightClicked(cell: Cell, candidate: number): void {
        this.candidateRightClicked.emit({ cell, candidate });
    }

    onKeyup(event: KeyboardEvent, row: number, col: number) {
        this.log.debug(`key ${event.key} in (${row}, ${col})`, event.key, row, col);
        this.tableRef.nativeElement.focus();
    }

    onTableKeyup(event: KeyboardEvent) {
        this.log.debug(`key ${event.key}`);
    }
}
