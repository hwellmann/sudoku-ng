import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { Cell } from 'app/generator/cell';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'sudoku-candidates',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './candidates.component.html',
})
export class CandidatesComponent {
    @Input()
    cell: Cell;

    @Output() readonly candidateClicked = new EventEmitter<number>();
    @Output() readonly candidateRightClicked = new EventEmitter<number>();

    onCandidateClicked(candidate: number): void {
        this.candidateClicked.emit(candidate);
    }

    onCandidateRightClicked(candidate: number): boolean {
        this.candidateRightClicked.emit(candidate);
        return false;
    }
}
