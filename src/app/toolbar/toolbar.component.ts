import { Component, EventEmitter, Output } from '@angular/core';
import { MatSidenav } from '@angular/material';

export abstract class ToolbarApp {
    abstract readonly sidenav: MatSidenav;
    abstract readonly isUserDefined: boolean;
    abstract readonly score: number;
    abstract readonly pointsToWin: number;

    abstract toggleTimer(): void;
    abstract showStatistics(): void;
    abstract login(): void;
    abstract isSolved(): boolean;
}

@Component({
    selector: 'sudoku-toolbar',
    styleUrls: ['./toolbar.component.scss'],
    templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
    @Output() sidenavOpened = new EventEmitter<void>();

    constructor(public app: ToolbarApp) { }

    openSidenav(): void {
        this.sidenavOpened.emit();
    }
}
