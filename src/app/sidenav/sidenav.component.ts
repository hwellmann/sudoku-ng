import { Component } from '@angular/core';

export interface Theme {
    name: string;
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
}

export abstract class SidenavApp {

    abstract newGame(): void;
    abstract ownGame(): void;

    abstract about(): void;
}

@Component({
    selector: 'sudoku-sidenav',
    styleUrls: ['./sidenav.component.scss'],
    templateUrl: './sidenav.component.html',
})
export class SidenavComponent {

    constructor(public app: SidenavApp) {
    }
}
