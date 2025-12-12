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
      const exampleInput = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`;
      const expected = 2;
      const result = await day11.solver.part2(exampleInput);
      expect(result).toBe(expected);
    });

    it("should distinguish between flags set on transition vs on processing", async () => {
      // This test case shows the difference:
      // If flags are set when TRANSITIONING to fft/dac,
      // paths that split AFTER visiting both nodes may be miscounted
      const input = `svr: fft
fft: aaa bbb
aaa: dac
dac: out
bbb: out`;
      // Two distinct paths to out:
      // 1. svr -> fft -> aaa -> dac -> out (visits both fft and dac) ✓
      // 2. svr -> fft -> bbb -> out (visits fft but not dac) ✗
      // Expected: 1 path with both flags
      const expected = 1;
      const result = await day11.solver.part2(input);
      expect(result).toBe(expected);
    });

    it("should handle nodes that appear multiple times in different paths", async () => {
      // This tests if state tracking properly handles the same node
      // being reached with different flag states
      const input = `svr: aaa bbb
aaa: fft
bbb: intermediate
intermediate: ccc
fft: ccc
ccc: dac
dac: out`;
      // Paths:
      // svr -> aaa -> fft -> ccc -> dac -> out (has both) ✓
      // svr -> bbb -> intermediate -> ccc -> dac -> out (has neither until dac)
      //   This path visits ccc twice (once with F=true, once with F=false)
      // Expected: 1 path with both
      const expected = 1;
      const result = await day11.solver.part2(input);
      expect(result).toBe(expected);
    });

    it("should correctly handle fft/dac as intermediate nodes only", async () => {
      // This isolates the flag-setting behavior:
      // A node that IS fft should be processed with hasFFT=true
      const input = `svr: fft
fft: out`;
      // One path: svr -> fft -> out
      // This path visits fft but not dac
      // Expected: 0 (only one required flag)
      const expected = 0;
      const result = await day11.solver.part2(input);
      expect(result).toBe(expected);
    });

    it("should mark node as visited when processing it", async () => {
      // Critical test: when processing node "fft", it should be marked as visited
      // This path ONLY has fft and dac, nothing else
      const input = `svr: fft
fft: dac
dac: out`;
      // One path: svr -> fft -> dac -> out (has both) ✓
      // Expected: 1
      const expected = 1;
      const result = await day11.solver.part2(input);
      expect(result).toBe(expected);
    });

    it("should handle converging paths of different lengths", async () => {
      // This test ensures paths are counted correctly when they converge
      // after traveling different distances
      const input = `svr: fast slow
fast: converge
slow: x
x: y
y: converge
converge: fft
fft: dac
dac: out`;
      // Two paths, both visit fft and dac:
      // svr -> fast -> converge -> fft -> dac -> out ✓
      // svr -> slow -> x -> y -> converge -> fft -> dac -> out ✓
      // Expected: 2
      const expected = 2;
      const result = await day11.solver.part2(input);
      expect(result).toBe(expected);
    });
  });
});
