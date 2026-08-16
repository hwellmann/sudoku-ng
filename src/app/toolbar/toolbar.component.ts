import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'sudoku-toolbar',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatTooltipModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
    @Output() sidenavOpened = new EventEmitter<void>();

    openSidenav(): void {
        this.sidenavOpened.emit();
    }
}
