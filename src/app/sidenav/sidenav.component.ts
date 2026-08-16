import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export interface Theme {
    name: string;
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
}

export abstract class SidenavApp {

    abstract newGame(): void;
    abstract ownGame(): void;
    abstract importGame(): void;
    abstract resetGame(): void;

    abstract about(): void;
}

@Component({
    selector: 'sudoku-sidenav',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, TranslateModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './sidenav.component.html',
})
export class SidenavComponent {

    constructor(public app: SidenavApp) {
    }
}
