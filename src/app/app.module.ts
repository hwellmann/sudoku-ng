import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSidenavModule, MatToolbarModule, MatIconModule, MatButton, MatButtonModule, MatTooltipModule } from '@angular/material';

import { AppComponent } from './app.component';
import { GridComponent, GridApp } from './grid/grid.component';
import { SidenavComponent, SidenavApp } from './sidenav/sidenav.component';
import { ToolbarComponent, ToolbarApp } from './toolbar/toolbar.component';
import { GameController } from './game.controller';
import { DigitComponent, DigitApp } from './digit/digit.component';

@NgModule({
    declarations: [
        AppComponent,
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
        { provide: SidenavApp, useExisting: GameController },
        { provide: GridApp, useExisting: GameController },
        { provide: ToolbarApp, useExisting: GameController },
        { provide: DigitApp, useExisting: GameController }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
