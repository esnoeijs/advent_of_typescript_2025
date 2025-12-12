import { describe, expect, it } from "vitest";
import day11 from "./day11";

describe("Day 11", () => {
  describe("Part 1", () => {
    it("should solve example input", async () => {
      const exampleInput = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`;
      const expected = 5;
      const result = await day11.solver.part1(exampleInput);
      expect(result).toBe(expected);
    });
  });

  describe("Part 2", () => {
    it("should solve example input", async () => {
      const exampleInput = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`;
      const expected = 0;
      const result = await day11.solver.part2(exampleInput);
      expect(result).toBe(expected);
    });
  });
});
