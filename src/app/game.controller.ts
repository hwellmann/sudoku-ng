import { Injectable, OnInit, OnDestroy, ɵPlayState } from '@angular/core';
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
import { BacktrackingSolver } from './generator/backtracking-solver';

enum State {
    ENTER_GAME,
    PLAY,
    EDIT_CANDIDATES
}

@Injectable()
export class GameController implements SidenavApp, GridApp, DigitApp, CandidatesApp {
    isUserDefined: boolean;
    sudoku: Sudoku = new Sudoku();

    private asyncGenerator: AsyncGenerator = new AsyncGenerator(sudoku => this.sudoku = sudoku);
    private solver: BacktrackingSolver = new BacktrackingSolver();

    private readonly log: Logger = getLogger('GameController');

    private selectedDigit: number;
    private selectedCell: Cell;
    private state: State = State.PLAY;

    constructor(public snackBar: MatSnackBar) {
    }

    newGame(): void {
        this.log.info('new game');
        this.asyncGenerator.generateSolvedSudoku('medium');
    }

    ownGame(): void {
        this.log.info('own game');
        this.sudoku = new Sudoku();
        this.state = State.ENTER_GAME;
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
        if (this.state === State.ENTER_GAME) {
            if (cell.isCandidate(this.selectedDigit)) {
                this.sudoku.setCell(cell.index, this.selectedDigit);
            } else if (cell.value === this.selectedDigit) {
                this.sudoku.clearCell(cell.index);
            } else {
                this.sudoku.clearCell(cell.index);
                this.sudoku.setCell(cell.index, this.selectedDigit);
            }
        } else if (cell.isCandidate(this.selectedDigit)) {
            if (cell.solution === this.selectedDigit) {
                this.sudoku.setCell(cell.index, this.selectedDigit);
            }
            if (this.sudoku.isSolved()) {
                this.openSnackBar('solved', 'Solved!');
            }
        }
    }

    getField(row: number, col: number): Cell {
        const index = (row - 1) * NUM_DIGITS + (col - 1);
        return this.sudoku.getCell(index);
    }

    candidatesClicked(): void {
        if (this.state === State.PLAY) {
            this.state = State.EDIT_CANDIDATES;
            this.log.info('edit candidates');
        } else if (this.state === State.ENTER_GAME) {
            this.state = State.PLAY;
            const puzzle = new Sudoku(this.sudoku);
            const solutions = this.solver.solve(puzzle);
            solutions.forEach(s => this.log.info(s.asString()));
            if (solutions.length === 0) {
                this.openSnackBar('warning', 'This Sudoku has no solution');
            } else if (solutions.length > 1) {
                this.openSnackBar('warning', 'This Sudoku has more than one solution');
            }
            const solution = solutions[0];
            for (const solutionCell of solution.cells) {
                const cell = this.sudoku.getCell(solutionCell.index);
                cell.solution = solutionCell.value;
                if (cell.value) {
                    cell.given = true;
                }
            }
        }
    }

    digitClicked(value: number): void {
        this.selectedDigit = value;
        if (this.state === State.EDIT_CANDIDATES) {
            this.state = State.PLAY;
        }
        this.log.info('selected digit {}', value);
    }

    digitCssClass(value: number): DigitCssClass {
        return {
            exhaustedDigit: this.sudoku.isExhausted(value),
            selectedDigit: value === this.selectedDigit,
            candidateDigit: this.state === State.EDIT_CANDIDATES
        };
    }

    fieldCssClass(row: number, col: number): FieldCssClass {
        const cell = this.getField(row, col);
        return {
            field: true,
            initialClue: cell.given,
            groupForLastSolvedField: this.selectedDigit && cell.isCandidate(this.selectedDigit) && this.state !== State.ENTER_GAME,
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
        if (this.selectedDigit && this.state !== State.ENTER_GAME && cell.isCandidate(this.selectedDigit)) {
            classes.push('groupForLastSolvedField');
        }
        return classes.join(' ');
    }

    candidateClicked(cell: Cell, candidate: number): void {
        if (cell.isFilled()) {
            return;
        }
        if (this.state === State.EDIT_CANDIDATES) {
            this.addOrRemoveCandidate(candidate, cell);
        } else {
            this.cellClicked(cell);
        }
    }

    candidateRightClicked(cell: Cell, candidate: number): void {
        const oldSelectedDigit = this.selectedDigit;
        this.selectedDigit = candidate;
        this.cellClicked(cell);
        this.selectedDigit = oldSelectedDigit;
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
