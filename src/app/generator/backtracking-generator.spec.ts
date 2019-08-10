import { getLogger, Logger } from "@log4js2/core";
import { BacktrackingGenerator } from "./backtracking-generator";

describe("BacktrackingGenerator", () => {
    let log: Logger;
    let generator: BacktrackingGenerator;

    beforeEach(() => {
        log = getLogger("BacktrackingGenerator");
        generator = new BacktrackingGenerator();
    });

    test("should generate", () => {
        const sudoku = generator.generatePuzzle();
        log.info(sudoku.asString());
    });
});
