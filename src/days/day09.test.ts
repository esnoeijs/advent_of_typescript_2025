import { describe, expect, it } from "vitest";
import day09 from "./day09";

describe("Day 09", () => {
  describe("Part 1", () => {
    it("should solve example input", async () => {
      const exampleInput = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;
      const expected = 50;
      const result = await day09.solver.part1(exampleInput);
      expect(result).toBe(expected);
    });
  });

  describe("Part 2", () => {
    it("should solve example input", async () => {
      const exampleInput = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;
      const expected = 24;
      const result = await day09.solver.part2(exampleInput);
      expect(result).toBe(expected);
    });

    /*
    0123456789
    ..............
    .......#XXX#..
    .......X...X..
    ..#XXXX#...X..
    ..X........X..
    ..X....#X#.X..
    ..X....X.X.X..
    ..#XXXX#.#X#..
    ..............
    */
    it("should solve example input with dimple", async () => {
      const exampleInput = `7,1
11,1
11,7
9,7
9,5
7,5
7,7
2,7
2,3
7,3`;
      const expected = 30;
      const result = await day09.solver.part2(exampleInput);
      expect(result).toBe(expected);
    });
  });
});
