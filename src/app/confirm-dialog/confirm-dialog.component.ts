import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

export interface ConfirmDialogData {
    titleKey: string;
}

@Component({
    selector: 'sudoku-confirm-dialog',
    standalone: true,
    imports: [MatButtonModule, MatDialogModule, TranslatePipe],
    templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {}
}
