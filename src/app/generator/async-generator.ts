import { SolvedSudoku, Sudoku } from './sudoku';
import { fromWorker } from 'observable-webworker';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

export class AsyncGenerator {
    private requestStream = new ReplaySubject<string>(1);
    private observable = this.requestStream.asObservable();
    private subscription: Subscription;
    private sudokuStream: Observable<Sudoku>;

    constructor(consumer: (sudoku: Sudoku) => void, onError?: (error: unknown) => void) {
        this.sudokuStream = fromWorker<string, SolvedSudoku>(this.createWorker, this.observable)
            .pipe(map(ss => Sudoku.fromSolvedSudoku(ss)));
        this.subscription = this.sudokuStream.subscribe({
            next: consumer,
            error: onError,
        });
    }

    private createWorker(): Worker {
        return new Worker(new URL('./generator.worker', import.meta.url), { type: 'module' });
    }

    generateSolvedSudoku(level: string): void {
        this.requestStream.next(level);
    }

    onDestroy(): void {
        this.requestStream.complete();
        this.subscription.unsubscribe();
    }
}
