import { getLogger, Logger } from '@log4js2/core';
import { Sudoku } from 'app/generator/sudoku';
import { Classifier, Level } from './classifier';

describe('Classifier', () => {
    let log: Logger;
    let classifier: Classifier;

    beforeEach(() => {
        log = getLogger('ClassifierSpec');
        classifier = new Classifier();
    });


    test('should classify easy puzzle', () => {
        const sudoku = Sudoku.fromString('..26.7.3.1...........3.259.5..9..3.....781.....7..5..9.865.3...........2.5.8.46..');
        const level = classifier.classify(sudoku);
        expect(level).toBe(Level.EASY);
    });

});
