import { Component, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export interface Theme {
    name: string;
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
}

@Component({
    selector: 'sudoku-sidenav',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, TranslateModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './sidenav.component.html',
})
export class SidenavComponent {

    @Output() readonly newGame = new EventEmitter<void>();
    @Output() readonly ownGame = new EventEmitter<void>();
    @Output() readonly importGame = new EventEmitter<void>();
    @Output() readonly resetGame = new EventEmitter<void>();
    @Output() readonly about = new EventEmitter<void>();
}
