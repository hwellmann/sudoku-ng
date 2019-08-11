import { Component, Input } from '@angular/core';
import { Sudoku } from 'app/generator/sudoku';
import { Cell } from 'app/generator/cell';
import { GridApp } from 'app/grid/grid.component';

export abstract class CandidatesApp {
    abstract candidateClicked(cell: Cell, candidate: number): void;
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

}
