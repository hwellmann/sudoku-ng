export class Position {
    constructor(public row: number, public column: number) {
    }

    toString(): string {
        return `r${this.row}c${this.column}`;
    }
}