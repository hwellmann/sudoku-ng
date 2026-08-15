import { Sudoku } from "./sudoku";

export enum Action{
    SOLVE_CELL = "SOLVE_CELL",
    REMOVE_CANDIDATE = "REMOVE_CANDIDATE",
}

export class Move{
    constructor(
        public index: number,
        public digit: number,
        public action: Action,
        public sudoku: Sudoku
    ){}
}