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

const input$ = of('Hello from main thread');

@Injectable()
export class GameController implements SidenavApp, GridApp, DigitApp, CandidatesApp {
    isUserDefined: boolean;
    sudoku: Sudoku = new Sudoku();

    private generator: BacktrackingGenerator = new BacktrackingGenerator();

    private readonly log: Logger = getLogger('GameController');

    private selectedDigit: number;
    private selectedCell: Cell;
    private editCandidates = false;

    private clickStream = new Subject<string>();
    private observable = this.clickStream.asObservable();
    private subscription: Subscription;

    constructor() {
        this.subscription = fromWorker<string, SolvedSudoku>(this.createWorker, this.observable)
            .subscribe(message => this.handleWorkerResult(message));
    }

    private createWorker(): Worker {
        return new Worker('./generator.worker', { type: 'module' });
    }

    private handleWorkerResult(message: SolvedSudoku): void {
        this.sudoku = Sudoku.fromSolvedSudoku(message);
        this.log.info('from worker: {}', this.sudoku.asString());
    }

    newGame(): void {
        this.log.info('new game');
        this.clickStream.next('foo');
    }

    ownGame(): void {
        this.log.info('own game');
        this.clickStream.complete();
        this.subscription.unsubscribe();

    }

    about(): void {
        this.log.info('about game');
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
        this.log.info('candidates: {}', cell.candidates.toString());
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
