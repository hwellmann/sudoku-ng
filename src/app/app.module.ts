import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppComponent } from './app.component';
import { CandidatesComponent, CandidatesApp } from './candidates/candidates.component';
import { GridComponent, GridApp } from './grid/grid.component';
import { SidenavComponent, SidenavApp } from './sidenav/sidenav.component';
import { ToolbarComponent, ToolbarApp } from './toolbar/toolbar.component';
import { GameController } from './game.controller';
import { DigitComponent, DigitApp } from './digit/digit.component';

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
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTooltipModule
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
