import { DoWork, runWorker } from 'observable-webworker';
import { BacktrackingGenerator } from './backtracking-generator';
import { SolvedSudoku } from './sudoku';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger, configure, getLogger, LogLevel } from '@log4js2/core';

configure({
    level: LogLevel.INFO,
    virtualConsole: false
});

export class GeneratorWorker implements DoWork<string, SolvedSudoku> {
    private generator: BacktrackingGenerator = new BacktrackingGenerator();
    private readonly log: Logger = getLogger('GeneratorWorker');

    public work(input$: Observable<string>): Observable<SolvedSudoku> {
        return input$.pipe(
            map(message => {
                this.log.debug('received: {}', message);
                const sudoku = this.generator.generatePuzzle();
                this.log.debug('generated {}', sudoku.asString());
                return sudoku.asSolvedSudoku();
            }),
        );
    }
}

runWorker(GeneratorWorker);

