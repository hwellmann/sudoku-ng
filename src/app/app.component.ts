import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { GameController } from './game.controller';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'sudoku-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
    title = 'sudoku-ng';

    @ViewChild(MatSidenav, { static: true }) readonly sidenav!: MatSidenav;

    constructor(private gameController: GameController, private translate: TranslateService) {
        const currentLanguage = this.translate.getBrowserLang();
        this.translate.use(currentLanguage);
    }

    ngOnDestroy() {
        this.gameController.onDestroy();
    }
}
