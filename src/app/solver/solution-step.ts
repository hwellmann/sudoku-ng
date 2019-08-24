import BitSet from 'fast-bitset';
import { StepType } from './step-type';

export abstract class SolutionStep {
    type: StepType;
    unit: number;
    tuple: number[] = [];
    insertableCandidates: Map<number, BitSet> = new Map();
    deletableCandidates: Map<number, BitSet> = new Map();
}
