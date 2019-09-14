import { getLogger, Logger } from '@log4js2/core';
import { BacktrackingGenerator } from 'app/generator/backtracking-generator';
import { Sudoku } from 'app/generator/sudoku';
import { Classifier, Level } from './classifier';

describe('Classifier', () => {
    let log: Logger;
    let classifier: Classifier;
    let generator: BacktrackingGenerator;

    beforeEach(() => {
        log = getLogger('ClassifierSpec');
        classifier = new Classifier();
        generator = new BacktrackingGenerator();
    });


    test('should classify easy puzzle', () => {
        const sudoku = Sudoku.fromString('..26.7.3.1...........3.259.5..9..3.....781.....7..5..9.865.3...........2.5.8.46..');
        expect(classifier.classify(sudoku)).toBe(Level.EASY);
    });

    test('should classify medium puzzle', () => {
        const sudoku = Sudoku.fromString('.3.....7.....8..155.26.9..316...3...9...7.........5....2.....8.........9...452..7');
        expect(classifier.classify(sudoku)).toBe(Level.MEDIUM);
    });

    test('should classify hard puzzle', () => {
        const sudoku = Sudoku.fromString('........2.86.1.5345...........7.59....4....1.97...6.2......38..7.8....9.13....2..');
        expect(classifier.classify(sudoku)).toBe(Level.HARD);
    });

    xtest('generate and classify', () => {
        for (let i = 0; i < 10; i++) {
            const sudoku = generator.generatePuzzle();
            log.info(sudoku.asString());
            const level = classifier.classify(sudoku);
            log.info(level);
        }
    });
});
