import { CompositeSolver } from './composite-solver';
import { FullHouseSolver } from './full-house-solver';
import { NakedSingleSolver } from './naked-single-solver';
import { HiddenSingleSolver } from './hidden-single-solver';
import { NakedPairSolver } from './naked-pair-solver';
import { HiddenPairSolver } from './hidden-pair-solver';
import { HiddenTripleSolver } from './hidden-triple-solver';
import { NakedTripleSolver } from './naked-triple-solver';
import { NakedQuadrupleSolver } from './naked-quadruple-solver';
import { HiddenQuadrupleSolver } from './hidden-quadruple-solver';
import { StepType } from './step-type';
import { Sudoku } from 'app/generator/sudoku';
import { SolutionStep } from './solution-step';

export enum Level {
    EASY,
    MEDIUM,
    HARD
}

export class Classifier {
    private solver: CompositeSolver = new CompositeSolver([
        new FullHouseSolver(),
        new NakedSingleSolver(),
        new HiddenSingleSolver(),
        new NakedPairSolver(),
        new HiddenPairSolver(),
        new NakedTripleSolver(),
        new HiddenTripleSolver(),
        new NakedQuadrupleSolver(),
        new HiddenQuadrupleSolver()
    ]);

    private levelMap = new Map<StepType, Level>([
        [StepType.FULL_HOUSE, Level.EASY],
        [StepType.NAKED_SINGLE, Level.EASY],
        [StepType.HIDDEN_SINGLE, Level.EASY],
        [StepType.NAKED_PAIR, Level.MEDIUM],
        [StepType.HIDDEN_PAIR, Level.MEDIUM],
    ]);

    classify(sudoku: Sudoku): Level {
        this.solver.sudoku = sudoku;
        const steps: SolutionStep[] = this.solver.solveAll();
        if (!sudoku.isSolved()) {
            return Level.HARD;
        }
        let level = Level.EASY;
        for (const step of steps) {
            const stepLevel = this.levelMap.get(step.type);
            if (stepLevel === undefined) {
                return Level.HARD;
            }
            if (stepLevel > level) {
                level = stepLevel;
            }
        }
        return level;
    }
}
