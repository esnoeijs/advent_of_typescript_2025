import { describe, expect, it } from "vitest";
import day02 from "./day02";

describe("Day 02", () => {
  describe("Part 1", () => {
    it("should solve example input", async () => {
      // Add your example input and expected output here
      const exampleInput = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`;
      const expected = 1227775554;
      const result = await day02.solver.part1(exampleInput);
      expect(result).toBe(expected);
    });
  });

  describe("Part 2", () => {
    it("should solve example input", async () => {
      // Add your example input and expected output here
      const exampleInput = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`;
      const expected = 4174379265;
      const result = await day02.solver.part2(exampleInput);
      expect(result).toBe(expected);
    });
  });
});
