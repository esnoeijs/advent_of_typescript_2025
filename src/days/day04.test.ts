import { describe, expect, it } from "vitest";
import day04 from "./day04";

describe("Day 04", () => {
  describe("Part 1", () => {
    it("should solve example input", async () => {
      const exampleInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;
      const expected = 13;
      const result = await day04.solver.part1(exampleInput);
      expect(result).toBe(expected);
    });
  });

  describe("Part 2", () => {
    it("should solve example input", async () => {
      const exampleInput = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;
      const expected = 43;
      const result = await day04.solver.part2(exampleInput);
      expect(result).toBe(expected);
    });
  });
});
