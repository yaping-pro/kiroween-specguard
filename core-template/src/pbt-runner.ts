import * as fc from "fast-check";
import type { PbtRunResult } from "./types";

export interface PropertyDefinition<T> {
  name: string;
  arbitrary: fc.Arbitrary<T>;
  predicate: (val: T) => boolean;
  numRuns?: number;
}

export class PbtRunner {
  public static async verify<T>(prop: PropertyDefinition<T>): Promise<PbtRunResult> {
    const runs = prop.numRuns ?? 1000;
    const start = performance.now();

    try {
      fc.assert(
        fc.property(prop.arbitrary, (val) => {
          return prop.predicate(val);
        }),
        { numRuns: runs }
      );

      return {
        suiteName: prop.name,
        totalRuns: runs,
        passed: true,
        durationMs: Number((performance.now() - start).toFixed(2))
      };
    } catch (err: unknown) {
      return {
        suiteName: prop.name,
        totalRuns: runs,
        passed: false,
        counterexample: String(err),
        durationMs: Number((performance.now() - start).toFixed(2))
      };
    }
  }

  public static async verifyBatch(props: PropertyDefinition<any>[]): Promise<PbtRunResult[]> {
    const results: PbtRunResult[] = [];
    for (const p of props) {
      results.push(await this.verify(p));
    }
    return results;
  }
}
