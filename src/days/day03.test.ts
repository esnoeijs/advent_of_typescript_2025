import { describe, expect, it } from "vitest";
import day03 from "./day03";

describe("Day 03", () => {
  describe("Part 1", () => {
    it("should solve example input", async () => {
      // Add your example input and expected output here
      const exampleInput = `987654321111111
811111111111119
234234234234278
818181911112111`;
      const expected = 357;
      const result = await day03.solver.part1(exampleInput);
      expect(result).toBe(expected);
    });
  });

  describe("Part 2", () => {
    it("should solve example input", async () => {
      // Add your example input and expected output here
      const exampleInput = `987654321111111
811111111111119
234234234234278
818181911112111`;
      const expected = 3121910778619;
      const result = await day03.solver.part2(exampleInput);
      expect(result).toBe(expected);
    });
    it("should solve large input in reasonable time", async () => {
      // Add your example input and expected output here
      const exampleInput = `
98765498765432111237
21111816111111991234
23423423423427891239
81818891811211191235`;
      const expected = 3285516505945;
      const result = await day03.solver.part2(exampleInput);
      expect(result).toBe(expected);
    });
  });
});
