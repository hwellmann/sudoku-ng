const BITS_PER_INT = 31;

export default class BitSet {
  private readonly maxBit: number;
  private readonly bits = new Set<number>();

  constructor(nBitsOrKey: number | string) {
    if (typeof nBitsOrKey === 'number') {
      const nBits = nBitsOrKey || BITS_PER_INT;
      this.maxBit = nBits - 1;
      return;
    }

    const values = JSON.parse(`[${nBitsOrKey}]`) as number[];
    const decodedMaxBit = values.pop();
    const leadingZeros = values.pop() ?? 0;
    this.maxBit = decodedMaxBit ?? (BITS_PER_INT - 1);

    const words: number[] = [];
    for (let i = 0; i < leadingZeros; i++) {
      words.push(0);
    }
    words.push(...values);

    for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
      const word = words[wordIndex] >>> 0;
      for (let bit = 0; bit < BITS_PER_INT; bit++) {
        if ((word & (1 << bit)) !== 0) {
          const index = wordIndex * BITS_PER_INT + bit;
          if (index <= this.maxBit) {
            this.bits.add(index);
          }
        }
      }
    }
  }

  set(pos: number): void {
    if (this.isValid(pos)) {
      this.bits.add(pos);
    }
  }

  unset(pos: number): void {
    this.bits.delete(pos);
  }

  get(pos: number): boolean {
    return this.bits.has(pos);
  }

  clear(): void {
    this.bits.clear();
  }

  clone(): BitSet {
    const cloned = new BitSet(this.maxBit + 1);
    this.bits.forEach((value) => cloned.bits.add(value));
    return cloned;
  }

  isEmpty(): boolean {
    return this.bits.size === 0;
  }

  isEqual(other: BitSet): boolean {
    if (this.bits.size !== other.bits.size) {
      return false;
    }
    for (const value of this.bits) {
      if (!other.bits.has(value)) {
        return false;
      }
    }
    return true;
  }

  forEach(f: (a: number) => void): void {
    this.getIndices().forEach(f);
  }

  getIndices(): number[] {
    return Array.from(this.bits).sort((a, b) => a - b);
  }

  getCardinality(): number {
    return this.bits.size;
  }

  nextSetBit(from: number): number {
    for (const value of this.getIndices()) {
      if (value >= from) {
        return value;
      }
    }
    return -1;
  }

  and(bn: BitSet | number): BitSet {
    const result = new BitSet(this.maxBit + 1);
    if (typeof bn === 'number') {
      if (this.bits.has(bn)) {
        result.bits.add(bn);
      }
      return result;
    }

    for (const value of this.bits) {
      if (bn.bits.has(value)) {
        result.bits.add(value);
      }
    }
    return result;
  }

  or(bn: BitSet | number): BitSet {
    const result = this.clone();
    if (typeof bn === 'number') {
      if (this.isValid(bn)) {
        result.bits.add(bn);
      }
      return result;
    }

    bn.bits.forEach((value) => {
      if (this.isValid(value)) {
        result.bits.add(value);
      }
    });
    return result;
  }

  xor(bn: BitSet | number): BitSet {
    const result = this.clone();
    if (typeof bn === 'number') {
      if (result.bits.has(bn)) {
        result.bits.delete(bn);
      } else if (this.isValid(bn)) {
        result.bits.add(bn);
      }
      return result;
    }

    bn.bits.forEach((value) => {
      if (!this.isValid(value)) {
        return;
      }
      if (result.bits.has(value)) {
        result.bits.delete(value);
      } else {
        result.bits.add(value);
      }
    });
    return result;
  }

  toString(): string {
    return this.getIndices().join(',');
  }

  private isValid(pos: number): boolean {
    return pos >= 0 && pos <= this.maxBit;
  }
}
