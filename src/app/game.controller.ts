import { Injectable, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Logger, getLogger } from '@log4js2/core';
import { CandidatesApp } from './candidates/candidates.component';
import { DigitApp, DigitCssClass } from './digit/digit.component';
import { AsyncGenerator } from './generator/async-generator';
import { BacktrackingSolver } from './generator/backtracking-solver';
import { Cell, NUM_DIGITS } from './generator/cell';
import { Sudoku } from './generator/sudoku';
import { FieldCssClass, GridApp } from './grid/grid.component';
import { SidenavApp } from './sidenav/sidenav.component';
import { Action, Move } from './generator/move';

enum State {
    ENTER_GAME,
    PLAY,
    EDIT_CANDIDATES
}

@Injectable()
export class GameController implements SidenavApp, GridApp, DigitApp, CandidatesApp {
    isUserDefined: boolean;

    private readonly sudokuSignal = signal(new Sudoku());
    private readonly stateSignal = signal(State.PLAY);
    private selectedDigit: number;
    private selectedCell: Cell;
    private moves: Move[] = [];


    private asyncGenerator: AsyncGenerator;
    private solver: BacktrackingSolver = new BacktrackingSolver();

    private readonly log: Logger = getLogger('GameController');

    constructor(public snackBar: MatSnackBar, private translate: TranslateService) {
        this.asyncGenerator = new AsyncGenerator(
            sudoku => this.newGameGenerated(sudoku),
            () => this.newGameFailed()
        );
    }
    private get sudoku(): Sudoku {
        return this.sudokuSignal();
    }

    private set sudoku(value: Sudoku) {
        this.sudokuSignal.set(value);
    }

    private get state(): State {
        return this.stateSignal();
    }

    private set state(value: State) {
        this.stateSignal.set(value);
    }

    private newGameGenerated(sudoku: Sudoku): void {
        this.sudoku = sudoku;
        this.state = State.PLAY;
        this.selectedDigit = undefined;
        this.moves = [];
    }

    private newGameFailed(): void {
        this.openSnackBar('warning', 'generationFailed');
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
        this.openSnackBar('solved', 'aboutNotice');
    }

    private openSnackBar(cssClass: string, messageKey: string): void {
        const config = new MatSnackBarConfig();
        config.verticalPosition = 'bottom';
        config.horizontalPosition = 'center';
        config.duration = 3000;
        config.panelClass = [cssClass];
        this.snackBar.open(this.translate.instant(messageKey), undefined, config);
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
            const currentState = new Sudoku(this.sudoku);
            this.moves.push(new Move(cell.index, this.selectedDigit, Action.SOLVE_CELL, currentState));
            this.sudoku.setCell(cell.index, this.selectedDigit);
            if (this.sudoku.isSolved()) {
                this.openSnackBar('solved', 'solved');
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
                this.openSnackBar('warning', 'noSolution');
            } else if (solutions.length > 1) {
                this.openSnackBar('warning', 'multipleSolutions');
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
            selectedDigitCandidate: this.selectedDigit && cell.isCandidate(this.selectedDigit) && this.state !== State.ENTER_GAME,
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
            classes.push('selectedDigitCandidate');
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
            const currentState = new Sudoku(this.sudoku);
            this.moves.push(new Move(cell.index, this.selectedDigit, Action.REMOVE_CANDIDATE, currentState));
            cell.removeCandidate(candidate);
        }
    }

    undoClicked(): void {
        if (this.moves.length > 0) {
            const lastMove = this.moves.pop()!;
            this.sudoku = lastMove.sudoku;
        }
    }
}
