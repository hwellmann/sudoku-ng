import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatTooltipModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
    @Output() sidenavOpened = new EventEmitter<void>();

    constructor(public app: ToolbarApp) { }

    openSidenav(): void {
        this.sidenavOpened.emit();
    }
}
