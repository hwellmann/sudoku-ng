import { SolvedSudoku, Sudoku } from './sudoku';
import { Observable, Subject, Subscription } from 'rxjs';
import { fromWorker } from 'observable-webworker';
import { map } from 'rxjs/operators';

export class AsyncGenerator {
    private requestStream = new Subject<string>();
    private observable = this.requestStream.asObservable();
    private subscription: Subscription;
    private sudokuStream: Observable<Sudoku>;

    constructor(consumer: (sudoku: Sudoku) => void) {
        this.sudokuStream = fromWorker<string, SolvedSudoku>(this.createWorker, this.observable)
            .pipe(map(ss => Sudoku.fromSolvedSudoku(ss)));
        this.subscription = this.sudokuStream.subscribe(consumer);
    }

    private createWorker(): Worker {
        return new Worker('./generator.worker', { type: 'module' });
    }

    generateSolvedSudoku(level: string): void {
        this.requestStream.next(level);
    }

    onDestroy(): void {
        this.requestStream.complete();
        this.subscription.unsubscribe();
    }
}
