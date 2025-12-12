import { describe, expect, it } from "vitest";
import day10 from "./day10";

describe("Day 10 - Factory", () => {
  describe("Part 1", () => {
    it.skip("should solve example input", async () => {
      const exampleInput = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;
      const expected = 7;
      const result = await day10.solver.part1(exampleInput);
      expect(result).toBe(expected);
    });
    it.skip("should solve example input 1", async () => {
      const exampleInput = `
[#####.###.] (0,1,3,4,5,7,8) (0,2,3,4,5,6,7,8) (0,1,3,4,6,7,8,9) (0,3,4,5,7,9) (0,3,5,6,7,8,9) (0,2,4,5,7,8) (0,1,2) (0,5,7,8) (0,5,6) (3,9) (2,5,6,8,9) (0,1,2,3,4,6,7,8) (1,3,4,5,6,8,9) {284,45,50,74,48,286,268,75,99,62}
`;
      const expected = 1;
      const result = await day10.solver.part1(exampleInput);
      expect(result).toBe(expected);
    });
    it.skip("should solve example input 2", async () => {
      const exampleInput = `
[#.#####.#.] (1,2,6) (0,1,2,3,5,6,7,8) (0,1,2,4,5,6,7,8) (0,5,6,7,8) (1,2,4,6) (3,8) (2,4,6,7,8) (0,2,3,4,5,6,8,9) (0,2,4,8,9) (0,1,3,4,5,8,9) (0,1,2,4,6,7,8) (1,3,4,5,6,7,8,9) (4,9) {60,75,85,40,74,50,87,52,89,27}
`;
      const expected = 3;
      const result = await day10.solver.part1(exampleInput);
      expect(result).toBe(expected);
    });
    it.skip("should solve example input 3", async () => {
      const exampleInput = `
[..##..##] (3,5,7) (0,6) (2,3,5,6) (0,4,7) (0,1,3,4,5,7) (2,3,6,7) {36,15,11,34,16,33,31,25}
`;
      const expected = 1;
      const result = await day10.solver.part1(exampleInput);
      expect(result).toBe(expected);
    });
    it.skip("should solve example input 4", async () => {
      const exampleInput = `
[#....#.#.] (1,3,6,7) (1,2,3,4,7,8) (1,2,3,6,8) (5,7) (2,4,6,7) (3,5,6,8) (1,2,6,8) (0,4,5,6,7,8) (0,5,7,8) (0,1,3,5,8) {40,225,226,209,36,58,243,64,255}
`;
      const expected = 4;
      const result = await day10.solver.part1(exampleInput);
      expect(result).toBe(expected);
    });
  });

  describe("Part 2", () => {
    it("should solve example input", async () => {
      const exampleInput = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;
      const expected = 33;
      const result = await day10.solver.part2(exampleInput);
      expect(result).toBe(expected);
    });
  });
});
