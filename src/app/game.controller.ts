import { Injectable } from '@angular/core';
import { SidenavApp } from './sidenav/sidenav.component';
import { GridApp } from './grid/grid.component';

@Injectable()
export class GameController implements SidenavApp, GridApp {

    newGame(): void {
        console.log('new game');
    }

    ownGame(): void {
        console.log('own game');

    }

    about(): void {
        console.log('about game');
    }

    fieldClicked(row: number, col: number): void {
        console.log(`clicked row ${row}, column ${col}`);
    }
}