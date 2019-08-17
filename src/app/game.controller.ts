import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Logger, getLogger } from '@log4js2/core';
import { SidenavApp } from './sidenav/sidenav.component';
import { GridApp, FieldCssClass } from './grid/grid.component';
import { Sudoku, SolvedSudoku } from './generator/sudoku';
import { BacktrackingGenerator } from './generator/backtracking-generator';
import { Cell, NUM_DIGITS } from './generator/cell';
import { DigitApp, DigitCssClass } from './digit/digit.component';
import { CandidatesApp } from './candidates/candidates.component';
import { fromWorker } from 'observable-webworker';
import { of, Subject, Subscription } from 'rxjs';
import { AsyncGenerator } from './generator/async-generator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable()
export class GameController implements SidenavApp, GridApp, DigitApp, CandidatesApp {
    isUserDefined: boolean;
    sudoku: Sudoku = new Sudoku();

    private asyncGenerator: AsyncGenerator = new AsyncGenerator(sudoku => this.sudoku = sudoku);

    private readonly log: Logger = getLogger('GameController');

    private selectedDigit: number;
    private selectedCell: Cell;
    private editCandidates = false;

    constructor(public snackBar: MatSnackBar) {
    }

    newGame(): void {
        this.log.info('new game');
        this.asyncGenerator.generateSolvedSudoku('medium');
    }

    ownGame(): void {
        this.log.info('own game');
        this.openSnackBar('warning', 'Not yet implemented.');
    }

    onDestroy(): void {
        this.asyncGenerator.onDestroy();
    }

    about(): void {
        this.log.info('about game');
        this.openSnackBar('solved', 'This is just a silly notice.');
    }

    private openSnackBar(cssClass: string, message: string) {
        const config = new MatSnackBarConfig();
        config.verticalPosition = 'bottom';
        config.horizontalPosition = 'center';
        config.duration = 3000;
        config.panelClass = [cssClass];
        this.snackBar.open(message, undefined, config);
    }

    fieldClicked(row: number, col: number): void {
        this.log.info(`clicked row ${row}, column ${col}`);
        const cell: Cell = this.getField(row, col);
        this.selectedCell = cell;
        this.cellClicked(cell);
    }

    private cellClicked(cell: Cell): void {
        this.selectedCell = cell;
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

    candidatesClicked(): void {
        this.editCandidates = true;
        this.log.info('edit candidates');
    }

    digitClicked(value: number): void {
        this.selectedDigit = value;
        this.editCandidates = false;
        this.log.info('selected digit {}', value);
    }

    digitCssClass(value: number): DigitCssClass {
        return {
            exhaustedDigit: this.sudoku.isExhausted(value),
            selectedDigit: value === this.selectedDigit,
            candidateDigit: this.editCandidates
        };
    }

    fieldCssClass(row: number, col: number): FieldCssClass {
        const cell = this.getField(row, col);
        return {
            field: true,
            initialClue: cell.given,
            groupForLastSolvedField: this.selectedDigit && cell.isCandidate(this.selectedDigit),
            lastSolvedField: false,
            onlyOnePossibleDigit: cell.candidates.getCardinality() === 1,
            selectedDigit: this.selectedDigit === cell.value,
            selectedPosition: this.selectedCell && this.selectedCell.index === cell.index
        };
    }

    fieldCssClasses(row: number, col: number): string {
        const cell = this.getField(row, col);
        const classes: string[] = [];
        if (cell.candidates.getCardinality() === 1) {
            classes.push('onlyOnePossibleDigit');
        }
        if (this.selectedDigit === cell.value) {
            classes.push('selectedDigit');
        }
        if (this.selectedCell && this.selectedCell.index === cell.index) {
            classes.push('selectedPosition');
        }
        if (this.selectedDigit && cell.isCandidate(this.selectedDigit)) {
            classes.push('groupForLastSolvedField');
        }
        return classes.join(' ');
    }

    candidateClicked(cell: Cell, candidate: number): void {
        if (cell.isFilled()) {
            return;
        }
        if (this.editCandidates) {
            this.addOrRemoveCandidate(candidate, cell);
        } else {
            this.cellClicked(cell);
        }
    }

    private addOrRemoveCandidate(candidate: number, cell: Cell) {
        this.log.info('candidate {} clicked in cell {}', candidate, cell.index);
        if (cell.isCandidate(candidate)) {
            cell.removeCandidate(candidate);
        } else {
            cell.addCandidate(candidate);
        }
    }
}
