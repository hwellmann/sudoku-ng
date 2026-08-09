import { Component, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { GameController } from './game.controller';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'sudoku-root',
    standalone: false,
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
    title = 'sudoku-ng';
    private readonly supportedLanguages = ['de', 'en'];

    @ViewChild(MatSidenav, { static: true }) readonly sidenav!: MatSidenav;

    constructor(private gameController: GameController, private translate: TranslateService) {
        const browserLang = this.translate.getBrowserLang();
        const currentLanguage = this.supportedLanguages.includes(browserLang ?? '') ? browserLang! : 'en';
        this.translate.use(currentLanguage);
    }

    ngOnDestroy() {
        this.gameController.onDestroy();
    }
}
