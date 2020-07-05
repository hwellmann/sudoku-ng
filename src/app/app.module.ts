import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { CandidatesApp, CandidatesComponent } from './candidates/candidates.component';
import { DigitApp, DigitComponent } from './digit/digit.component';
import { GameController } from './game.controller';
import { GridApp, GridComponent } from './grid/grid.component';
import { SidenavApp, SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarApp, ToolbarComponent } from './toolbar/toolbar.component';


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}


@NgModule({
    declarations: [
        AppComponent,
        CandidatesComponent,
        DigitComponent,
        GridComponent,
        SidenavComponent,
        ToolbarComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatTooltipModule,
        TranslateModule.forRoot({
            defaultLanguage: 'en',
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [ HttpClient ]
            }
        })
    ],
    providers: [
        GameController,
        { provide: CandidatesApp, useExisting: GameController },
        { provide: SidenavApp, useExisting: GameController },
        { provide: GridApp, useExisting: GameController },
        { provide: ToolbarApp, useExisting: GameController },
        { provide: DigitApp, useExisting: GameController }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
