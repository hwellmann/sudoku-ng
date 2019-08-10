import BitSet from 'fast-bitset';

export const DIGITS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const NUM_DIGITS = DIGITS.length;

export class Cell {

    readonly index: number = 0;
    private digit = 0;
    solution = 0;
    given = false;
    readonly candidates: BitSet = new BitSet(NUM_DIGITS + 1);

    constructor(arg: number | Cell) {
        if (typeof arg === 'number') {
            this.index = arg;
            DIGITS.forEach((d) => this.candidates.set(d));
        } else if (arg instanceof Cell) {
            this.index = arg.index;
            this.digit = arg.digit;
            this.solution = arg.solution;
            this.given = arg.given;
            this.candidates = arg.candidates.clone();
        }
    }

    clear(): void {
        this.value = 0;
        this.solution = 0;
        this.given = false;
        this.candidates.clear();
        DIGITS.forEach((d) => this.candidates.set(d));
    }

    set value(value: number) {
        this.digit = value;
        this.candidates.clear();
    }

    get value(): number {
        return this.digit;
    }

    isFilled(): boolean {
        return this.digit !== 0;
    }

    isEmpty(): boolean {
        return this.digit === 0;
    }

    isCandidate(digit: number): boolean {
        return this.candidates.get(digit);
    }

    removeCandidate(digit: number): void {
        this.candidates.unset(digit);
    }

    isUnsatisfiable(): boolean {
        return this.isEmpty() && this.candidates.isEmpty();
    }

    asString(): string {
        if (this.digit === 0) {
            return '.';
        }
        return this.digit.toString();
    }
}
