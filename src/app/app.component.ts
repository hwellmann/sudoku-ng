import { Component, HostListener, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { GameController } from './game.controller';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { GridComponent } from './grid/grid.component';
import { DigitComponent } from './digit/digit.component';

@Component({
    selector: 'sudoku-root',
    standalone: true,
    imports: [MatSidenavModule, MatDialogModule, MatToolbarModule, ToolbarComponent, SidenavComponent, GridComponent, DigitComponent],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager
})
export class AppComponent implements OnDestroy {
    title = 'sudoku-ng';
    private readonly supportedLanguages = ['de', 'en'];

    @ViewChild(MatSidenav, { static: true }) readonly sidenav!: MatSidenav;

    constructor(public game: GameController, private translate: TranslateService) {
        const browserLang = this.translate.getBrowserLang();
        const currentLanguage = this.supportedLanguages.includes(browserLang ?? '') ? browserLang! : 'en';
        this.translate.use(currentLanguage);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyPressed(event: KeyboardEvent): void {
        const target = event.target;
        if (target instanceof HTMLElement && target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')) {
            return;
        }
        const key = event.code === 'Space' ? ' ' : event.key;
        if (this.game.keyPressed(key)) {
            event.preventDefault();
        }
    }

    ngOnDestroy() {
        this.game.onDestroy();
    }
}
