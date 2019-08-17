import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { GameController } from './game.controller';

@Component({
  selector: 'sudoku-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'sudoku-ng';

  @ViewChild(MatSidenav, { static: true }) readonly sidenav!: MatSidenav;

  constructor(private gameController: GameController) {
  }

  ngOnDestroy() {
      this.gameController.onDestroy();
  }

}
