import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Sudoku } from '../generator/sudoku';

export interface DigitCssClass {
    selectedDigit: boolean;
    exhaustedDigit: boolean;
    candidateDigit: boolean;
}

@Component({
    selector: 'sudoku-digit',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, TranslateModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './digit.component.html',
})
export class DigitComponent {
    @Input()
    sudoku: Sudoku;

    @Input()
    selectedDigit: number;

    @Input()
    candidateMode = false;

    @Output() readonly digitClicked = new EventEmitter<number>();
    @Output() readonly candidatesClicked = new EventEmitter<void>();
    @Output() readonly undoClicked = new EventEmitter<void>();

    digitCssClass(value: number): DigitCssClass {
        return {
            exhaustedDigit: this.sudoku.isExhausted(value),
            selectedDigit: value === this.selectedDigit,
            candidateDigit: this.candidateMode
        };
    }

    onDigitClicked(value: number): void {
        this.digitClicked.emit(value);
    }

    onCandidatesClicked(): void {
        this.candidatesClicked.emit();
    }

    onUndoClicked(): void {
        this.undoClicked.emit();
    }
}
