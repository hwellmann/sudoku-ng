import { Injectable, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Logger, getLogger } from '@log4js2/core';
import { AsyncGenerator } from './generator/async-generator';
import { BacktrackingSolver } from './generator/backtracking-solver';
import { Cell } from './generator/cell';
import { Sudoku } from './generator/sudoku';
import { Action, Move } from './generator/move';
import { APP_VERSION } from '../version';
import { ImportDialogComponent } from './import-dialog/import-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

enum State {
    ENTER_GAME,
    PLAY,
    EDIT_CANDIDATES
}

@Injectable()
export class GameController {

    private readonly sudokuSignal = signal(new Sudoku());
    private readonly stateSignal = signal(State.PLAY);
    private selectedDigitValue: number;
    private selectedCellValue: Cell;
    private moves: Move[] = [];


    private asyncGenerator: AsyncGenerator;
    private solver: BacktrackingSolver = new BacktrackingSolver();

    private readonly log: Logger = getLogger('GameController');

    constructor(public snackBar: MatSnackBar, private translate: TranslateService, private dialog: MatDialog) {
        this.asyncGenerator = new AsyncGenerator(
            sudoku => this.newGameGenerated(sudoku),
            () => this.newGameFailed()
        );
    }

    get sudoku(): Sudoku {
        return this.sudokuSignal();
    }

    private set sudoku(value: Sudoku) {
        this.sudokuSignal.set(value);
    }

    get selectedDigit(): number {
        return this.selectedDigitValue;
    }

    get selectedCell(): Cell {
        return this.selectedCellValue;
    }

    get isEnterGameMode(): boolean {
        return this.state === State.ENTER_GAME;
    }

    get isCandidateMode(): boolean {
        return this.state === State.EDIT_CANDIDATES;
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
        this.selectedDigitValue = undefined;
        this.moves = [];
    }

    private newGameFailed(): void {
        this.openSnackBar('warning', 'generationFailed');
    }

    get isGameInProgress(): boolean {
        return this.moves.length > 0 && !this.sudoku.isSolved();
    }

    /** Runs the action directly, or after user confirmation if a game is in progress. */
    private confirmed(titleKey: string, action: () => void): void {
        if (!this.isGameInProgress) {
            action();
            return;
        }
        this.dialog.open(ConfirmDialogComponent, { data: { titleKey } })
            .afterClosed()
            .subscribe(confirmed => {
                if (confirmed) {
                    action();
                }
            });
    }

    newGame(): void {
        this.confirmed('newGame', () => {
            this.log.info('new game');
            this.asyncGenerator.generateSolvedSudoku('medium');
        });
    }

    ownGame(): void {
        this.confirmed('ownGame', () => {
            this.log.info('own game');
            this.sudoku = new Sudoku();
            this.state = State.ENTER_GAME;
        });
    }

    importGame(): void {
        this.confirmed('importGame', () => {
            this.log.info('import game');
            this.dialog.open(ImportDialogComponent)
                .afterClosed()
                .subscribe(text => this.importGameText(text));
        });
    }

    private importGameText(text: string | null | undefined): void {
        if (text === null || text === undefined) {
            return;
        }
        try {
            this.sudoku = Sudoku.fromString(text);
            this.state = State.PLAY;
            this.selectedDigitValue = undefined;
            this.selectedCellValue = undefined;
            this.moves = [];
        } catch (error) {
            this.log.warn('failed to import game', error);
            this.openSnackBar('warning', 'invalidGame');
        }
    }

    resetGame(): void {
        this.confirmed('resetGame', () => {
            this.log.info('reset game');
            if (this.moves.length > 0) {
                const firstMove = this.moves[0];
                this.sudoku = firstMove.sudoku;
                this.moves = [];
            }
        });
    }

    onDestroy(): void {
        this.asyncGenerator.onDestroy();
    }

    about(): void {
        this.log.info(`about game, version ${APP_VERSION.version}, commit ${APP_VERSION.commit}`);
        this.openSnackBar('solved', 'aboutNotice', {
            version: APP_VERSION.version,
            date: APP_VERSION.timestamp.slice(0, 10)
        });
    }

    private openSnackBar(cssClass: string, messageKey: string, params?: object): void {
        const config = new MatSnackBarConfig();
        config.verticalPosition = 'bottom';
        config.horizontalPosition = 'center';
        config.duration = 3000;
        config.panelClass = [cssClass];
        this.snackBar.open(this.translate.instant(messageKey, params), undefined, config);
    }

    cellClicked(cell: Cell): void {
        this.log.info(`clicked cell ${cell.index}`);
        this.selectedCellValue = cell;
        if (this.selectedDigitValue === undefined) {
            return;
        }
        if (this.state === State.ENTER_GAME) {
            if (cell.isCandidate(this.selectedDigitValue)) {
                this.sudoku.setCell(cell.index, this.selectedDigitValue);
            } else if (cell.value === this.selectedDigitValue) {
                this.sudoku.clearCell(cell.index);
            } else {
                this.sudoku.clearCell(cell.index);
                this.sudoku.setCell(cell.index, this.selectedDigitValue);
            }
        } else if (cell.isCandidate(this.selectedDigitValue)) {
            const currentState = new Sudoku(this.sudoku);
            this.moves.push(new Move(cell.index, this.selectedDigitValue, Action.SOLVE_CELL, currentState));
            this.sudoku.setCell(cell.index, this.selectedDigitValue);
            if (this.sudoku.isSolved()) {
                this.openSnackBar('solved', 'solved');
            }
        }
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
        this.selectedDigitValue = value;
        if (this.state === State.EDIT_CANDIDATES) {
            this.state = State.PLAY;
        }
        this.log.info('selected digit {}', value);
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
        const oldSelectedDigit = this.selectedDigitValue;
        this.selectedDigitValue = candidate;
        this.cellClicked(cell);
        this.selectedDigitValue = oldSelectedDigit;
    }

    private addOrRemoveCandidate(candidate: number, cell: Cell) {
        this.log.info('candidate {} clicked in cell {}', candidate, cell.index);
        if (cell.isCandidate(candidate)) {
            const currentState = new Sudoku(this.sudoku);
            this.moves.push(new Move(cell.index, this.selectedDigitValue, Action.REMOVE_CANDIDATE, currentState));
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
