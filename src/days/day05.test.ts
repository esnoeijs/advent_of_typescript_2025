import { describe, expect, it } from "vitest";
import day05 from "./day05";

describe("Day 05", () => {
  describe("Part 1", () => {
    it("should solve example input", async () => {
      const exampleInput = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;
      const expected = 3;
      const result = await day05.solver.part1(exampleInput);
      expect(result).toBe(expected);
    });
  });

  describe("Part 2", () => {
    it("should solve example input", async () => {
      const exampleInput = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;
      const expected = 14;
      const result = await day05.solver.part2(exampleInput);
      expect(result).toBe(expected);
    });
  });
});
