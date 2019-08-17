import { Component, Input } from '@angular/core';
import { Cell } from 'app/generator/cell';

export abstract class CandidatesApp {
    abstract candidateClicked(cell: Cell, candidate: number): void;
    abstract candidateRightClicked(cell: Cell, candidate: number): void;
}


@Component({
    selector: 'sudoku-candidates',
    styleUrls: ['./candidates.component.scss'],
    templateUrl: './candidates.component.html',
})
export class CandidatesComponent {
    @Input()
    cell: Cell;

    constructor(public app: CandidatesApp) { }

    candidateClicked(candidate: number): void {
        this.app.candidateClicked(this.cell, candidate);
    }

    candidateRightClicked(candidate: number): boolean {
        this.app.candidateRightClicked(this.cell, candidate);
        return false;
    }

}
