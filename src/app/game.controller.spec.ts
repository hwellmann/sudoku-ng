import '@angular/compiler';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { GameController } from './game.controller';
import { BacktrackingGenerator } from './generator/backtracking-generator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

describe('GameController keyboard entry', () => {
    let controller: GameController;

    beforeEach(() => {
        const snackBar: Partial<MatSnackBar> = {
            open: vi.fn()
        };

        const translate: Partial<TranslateService> = {
            instant: vi.fn((key: string) => key)
        };

        const dialog: Partial<MatDialog> = {
            open: vi.fn()
        };

        controller = new GameController(
            snackBar as MatSnackBar,
            translate as TranslateService,
            dialog as MatDialog
        ); controller.ownGame();
    });

    afterEach(() => controller.onDestroy());

    test('starts with cell 0 highlighted', () => {
        expect(controller.isEnterGameMode).toBe(true);
        expect(controller.selectedCell.index).toBe(0);
    });

    test('typing a digit fills the highlighted cell and advances once', () => {
        expect(controller.keyPressed('5')).toBe(true);

        expect(controller.sudoku.getCell(0).value).toBe(5);
        expect(controller.selectedCell.index).toBe(1);
    });

    test('space skips one cell', () => {
        expect(controller.keyPressed(' ')).toBe(true);

        expect(controller.sudoku.getCell(0).isEmpty()).toBe(true);
        expect(controller.selectedCell.index).toBe(1);
    });

    test('period skips one cell', () => {
        expect(controller.keyPressed('.')).toBe(true);

        expect(controller.selectedCell.index).toBe(1);
    });

    test('typing a digit after a skip fills the following cell', () => {
        controller.keyPressed('.');
        controller.keyPressed('7');

        expect(controller.sudoku.getCell(0).isEmpty()).toBe(true);
        expect(controller.sudoku.getCell(1).value).toBe(7);
        expect(controller.selectedCell.index).toBe(2);
    });

    test('clicking to fill a cell advances the keyboard position once', () => {
        controller.digitClicked(8);
        controller.cellClicked(controller.sudoku.getCell(4));

        expect(controller.sudoku.getCell(4).value).toBe(8);
        expect(controller.selectedCell.index).toBe(5);

        controller.keyPressed('3');

        expect(controller.sudoku.getCell(5).value).toBe(3);
        expect(controller.selectedCell.index).toBe(6);
    });

    test('invalid keys do not move the cursor', () => {
        expect(controller.keyPressed('x')).toBe(false);
        expect(controller.selectedCell.index).toBe(0);
    });

    test('input stops after cell 80', () => {
        for (let index = 0; index < 81; index++) {
            expect(controller.keyPressed('.')).toBe(true);
        }

        expect(controller.selectedCell).toBeUndefined();
        expect(controller.keyPressed('.')).toBe(false);
        expect(controller.keyPressed('1')).toBe(false);
    });
});

describe('GameController generated game', () => {
    let controller: GameController;

    beforeEach(() => {
        const snackBar: Partial<MatSnackBar> = {
            open: vi.fn()
        };
        const translate: Partial<TranslateService> = {
            instant: vi.fn((key: string) => key)
        };
        const dialog: Partial<MatDialog> = {
            open: vi.fn()
        };

        controller = new GameController(
            snackBar as MatSnackBar,
            translate as TranslateService,
            dialog as MatDialog
        );
        controller.ownGame();
    });

    afterEach(() => controller.onDestroy());

    test('generates and plays a complete game', () => {
        const puzzle = new BacktrackingGenerator().generatePuzzle();

        for (const cell of puzzle.cells) {
            controller.keyPressed(cell.isFilled() ? String(cell.value) : '.');
        }

        controller.candidatesClicked();

        expect(controller.isEnterGameMode).toBe(false);
        expect(controller.sudoku.solutionAsString).toBe(puzzle.solutionAsString);

        for (const cell of controller.sudoku.cells) {
            if (cell.isEmpty()) {
                controller.digitClicked(cell.solution);
                controller.cellClicked(cell);
            }
        }

        expect(controller.sudoku.isSolved()).toBe(true);
    });
});
