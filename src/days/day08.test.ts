import { describe, expect, it } from "vitest";
import day08 from "./day08";

describe("Day 08", () => {
  describe("Part 1", () => {
    it("should solve example input", async () => {
      // Set the pair count for test input
      process.env.AOC_DAY08_PAIR_COUNT = "10";
      const exampleInput = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;
      const expected = 40;
      const result = await day08.solver.part1(exampleInput);
      expect(result).toBe(expected);
    });
  });

  describe("Part 2", () => {
    it("should solve example input", async () => {
      const exampleInput = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;
      const expected = 25272;
      const result = await day08.solver.part2(exampleInput);
      expect(result).toBe(expected);
    });
  });
});
