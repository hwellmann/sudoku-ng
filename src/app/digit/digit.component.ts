import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface DigitCssClass {
    selectedDigit: boolean;
    exhaustedDigit: boolean;
    candidateDigit: boolean;
}

export abstract class DigitApp {
    abstract readonly isUserDefined: boolean;

    abstract digitClicked(value: number): void;
    abstract candidatesClicked(): void;
    abstract checkpointClicked(): void;
    abstract revertClicked(): void;
    abstract digitCssClass(value: number): DigitCssClass;
}

@Component({
    selector: 'sudoku-digit',
    styleUrls: ['./digit.component.scss'],
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './digit.component.html',
})
export class DigitComponent {
    constructor(public app: DigitApp) { }
}
