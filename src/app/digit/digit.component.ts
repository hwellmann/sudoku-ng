import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

export interface DigitCssClass {
    selectedDigit: boolean;
    exhaustedDigit: boolean;
    candidateDigit: boolean;
}

export abstract class DigitApp {
    abstract readonly isUserDefined: boolean;

    abstract digitClicked(value: number): void;
    abstract candidatesClicked(): void;
    abstract undoClicked(): void;
    abstract digitCssClass(value: number): DigitCssClass;
}

@Component({
    selector: 'sudoku-digit',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, TranslateModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './digit.component.html',
})
export class DigitComponent {
    constructor(public app: DigitApp) { }
}
