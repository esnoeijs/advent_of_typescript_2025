import type { DayModule } from "./types.js";

type Range = {
  min: number;
  max: number;
};

function createFreshRanges(freshRangesInput: string): Range[] {
  return freshRangesInput.split("\n").map((rangeInput) => {
    const rangeNums = rangeInput.split("-").map(Number);
    if (rangeNums.length !== 2) throw new Error("Invalid input");
    return { min: rangeNums[0] as number, max: rangeNums[1] as number };
  });
}

const solver: DayModule["solver"] = {
  async part1(_input: string) {
    const [freshRangesInput, ingredientIds] = _input.split("\n\n");
    if (freshRangesInput == undefined || ingredientIds === undefined)
      throw new Error("invalid input");

    const freshRanges = createFreshRanges(freshRangesInput);

    return ingredientIds
      .split("\n")
      .map(Number)
      .filter((ingredientId) =>
        freshRanges.some(
          (range) => ingredientId >= range.min && ingredientId <= range.max,
        ),
      ).length;
  },

  async part2(_input: string) {
    const [freshRangesInput, ingredientIds] = _input.split("\n\n");
    if (freshRangesInput == undefined || ingredientIds === undefined)
      throw new Error("invalid input");

    const freshRanges = createFreshRanges(freshRangesInput);
    freshRanges.sort((a, b) => a.min - b.min);

    for (let idx = 0; idx < freshRanges.length; idx++) {
      const range = freshRanges[idx];
      if (range === undefined) break;

      let peekIdx = idx;
      let spliceCount = 0;
      while (true) {
        peekIdx++;
        const peekRange = freshRanges[peekIdx];
        if (peekRange === undefined || range.max + 1 < peekRange.min) {
          break;
        }
        range.max = Math.max(range.max, peekRange.max);
        spliceCount++;
      }
      if (spliceCount > 0) freshRanges.splice(idx + 1, spliceCount);
    }

    return freshRanges.reduce(
      (acc, range) => acc + (range.max - range.min) + 1,
      0,
    );
  },
};

const day05: DayModule = {
  id: 5,
  title: "Cafeteria",
  solver,
};

export default day05;
