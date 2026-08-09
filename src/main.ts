import { enableProdMode, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { configure, LogLevel } from '@log4js2/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app/app.component';
import { CandidatesApp } from './app/candidates/candidates.component';
import { DigitApp } from './app/digit/digit.component';
import { GameController } from './app/game.controller';
import { GridApp } from './app/grid/grid.component';
import { SidenavApp } from './app/sidenav/sidenav.component';
import { ToolbarApp } from './app/toolbar/toolbar.component';
import { environment } from './environments/environment';

configure({
    level: LogLevel.INFO,
    virtualConsole: false
});

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    importProvidersFrom(
      TranslateModule.forRoot({
        fallbackLang: 'en',
        loader: {
          provide: TranslateLoader,
          useClass: TranslateHttpLoader,
        }
      })
    ),
    ...provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json'
    }),
    GameController,
    { provide: CandidatesApp, useExisting: GameController },
    { provide: SidenavApp, useExisting: GameController },
    { provide: GridApp, useExisting: GameController },
    { provide: ToolbarApp, useExisting: GameController },
    { provide: DigitApp, useExisting: GameController }
  ]
})
  .catch(err => console.error(err));
