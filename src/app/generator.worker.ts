import { DoWork, ObservableWorker } from 'observable-webworker';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger, getLogger } from '@log4js2/core';
import { BacktrackingGenerator } from './generator/backtracking-generator';
import { Sudoku, SolvedSudoku } from './generator/sudoku';

import { configure, LogLevel } from '@log4js2/core';

configure({
    level: LogLevel.INFO,
    virtualConsole: false
});


@ObservableWorker()
export class GeneratorWorker implements DoWork<string, SolvedSudoku> {

    private readonly log: Logger = getLogger('GeneratorWorker');
    private generator: BacktrackingGenerator = new BacktrackingGenerator();

    public work(input$: Observable<string>): Observable<SolvedSudoku> {
        return input$.pipe(
            map(message => {
                this.log.debug('received: {}', message);
                const sudoku: Sudoku = this.generator.generatePuzzle();
                this.log.debug('generated {}', sudoku.asString());
                return sudoku.asSolvedSudoku();
            }),
        );
    }
}

