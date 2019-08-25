import fs from 'fs';
import { HodokuCandidatesParser } from './hodoku-parser';

describe('HodokuCandidatesParser', () => {

    test('should parse', () => {
        const text = fs.readFileSync('src/assets/naked-pair-cand.txt', 'utf8');
        const parser = new HodokuCandidatesParser();
        const sudoku = parser.parse(text);
        expect(sudoku.getCell(2).candidates.getIndices()).toEqual([1, 2, 4]);
        expect(sudoku.getCell(6).value).toEqual(3);
        expect(sudoku.getCell(6).given).toBeFalsy();
        expect(sudoku.getCell(8).value).toEqual(5);
        expect(sudoku.getCell(8).given).toBeTruthy();
    });
});
