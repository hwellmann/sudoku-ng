declare module "fast-bitset" {
  class BitSet {
    constructor(nBitsOrKey: number | string);
    set(pos: number): void;
    unset(pos: number): void;
    get(pos: number): boolean;
    clear(): void;
    clone(): BitSet;
    isEmpty(): boolean;
    isEqual(other: BitSet): boolean;
    forEach(f: (a: number) => void): void;
    getIndices(): number[]
    getCardinality(): number;
    nextSetBit(from: number): number;
    toString(): string;
    and(bn: BitSet | number): BitSet;
    or(bn: BitSet | number): BitSet;
    xor(bn: BitSet | number): BitSet;
  }

  export default BitSet;
}
