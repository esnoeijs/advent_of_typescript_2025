import { describe, expect, it } from "vitest";
import day06 from "./day06";

describe("Day 06", () => {
  describe("Part 1", () => {
    it("should solve example input", async () => {
      const exampleInput = `123 328  51 64
 45 64  387 23
  6 98  215 314
*   +   *   +  `;
      const expected = 4277556;
      const result = await day06.solver.part1(exampleInput);
      expect(result).toBe(expected);
    });
  });

  describe("Part 2", () => {
    it("should solve example input", async () => {
      const exampleInput = `123 328  51 64
 45 64  387 23
  6 98  215 314
*   +   *   +  `;
      const expected = 3263827;
      const result = await day06.solver.part2(exampleInput);
      expect(result).toBe(expected);
    });
    it("should solve example input where first line is shorter", async () => {
      const exampleInput = `123 328  51 64
 45 64  387 48
  6 98  215 3272
*   +   *   +  `;
      const expected = 3263903;
      const result = await day06.solver.part2(exampleInput);
      expect(result).toBe(expected);
    });
  });
});
