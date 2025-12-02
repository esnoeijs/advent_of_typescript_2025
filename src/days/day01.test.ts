import { describe, it, expect } from "vitest";
import day01 from "./day01";

describe("Day 01", () => {
  describe("Part 1", () => {
    it("should solve example input", async () => {
      // Add your example input and expected output here
      const exampleInput = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;
      const expected = 3;
      const result = await day01.solver.part1(exampleInput);
      expect(result).toBe(expected);
    });
  });

  describe("Part 2", () => {
    it("should solve example input", async () => {
      // Add your example input and expected output here
      const exampleInput = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;
      const expected = 6;
      const result = await day01.solver.part2(exampleInput);
      expect(result).toBe(expected);
    }),
    it("should account for large rotations", async () => {
      // Add your example input and expected output here
      const exampleInput = `R1000
L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;
      const expected = 16;
      const result = await day01.solver.part2(exampleInput);
      expect(result).toBe(expected);
    });
  });
});
