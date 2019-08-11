import { Component } from '@angular/core';

export interface DigitCssClass {
    selectedDigit: boolean;
    exhaustedDigit: boolean;
}

export abstract class DigitApp {
    abstract readonly isUserDefined: boolean;

    abstract digitClicked(value: number): void;
    abstract digitCssClass(value: number): DigitCssClass;
}

@Component({
    selector: 'sudoku-digit',
    styleUrls: ['./digit.component.scss'],
    templateUrl: './digit.component.html',
})
export class DigitComponent {
    constructor(public app: DigitApp) { }
}
