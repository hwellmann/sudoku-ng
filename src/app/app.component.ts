import { Component, OnDestroy, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { GameController } from './game.controller';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { GridComponent } from './grid/grid.component';
import { DigitComponent } from './digit/digit.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'sudoku-root',
    standalone: true,
    imports: [MatSidenavModule, MatToolbarModule, ToolbarComponent, SidenavComponent, GridComponent, DigitComponent],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
    title = 'sudoku-ng';
    private readonly supportedLanguages = ['de', 'en'];
    private readonly gameChangedSubscription: Subscription;

    @ViewChild(MatSidenav, { static: true }) readonly sidenav!: MatSidenav;

    constructor(private gameController: GameController, private translate: TranslateService, private cdr: ChangeDetectorRef) {
        const browserLang = this.translate.getBrowserLang();
        const currentLanguage = this.supportedLanguages.includes(browserLang ?? '') ? browserLang! : 'en';
        this.translate.use(currentLanguage);
        this.gameChangedSubscription = this.gameController.gameChanged.subscribe(() => {
            this.cdr.detectChanges();
        });
    }

    ngOnDestroy() {
        this.gameChangedSubscription.unsubscribe();
        this.gameController.onDestroy();
    }
}
