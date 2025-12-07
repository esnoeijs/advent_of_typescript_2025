import type { DayModule } from "./types";

const solver: DayModule["solver"] = {
  async part1(_input: string) {
    const grid: string[][] = _input
      .trim()
      .split("\n")
      .map((line) => line.trim().split(""));
    if (
      grid.length === 0 ||
      !grid.every((line) => line.length === grid[0]?.length)
    ) {
      throw new Error("invalid input");
    }

    const startIdx = grid[0]?.indexOf("S");
    if (startIdx === undefined || startIdx === -1) {
      throw new Error("invalid input");
    }

    let traceIndexes = new Set<number>([startIdx]);
    let output = 0;

    for (const [lineIdx, line] of grid.entries()) {
      for (const traceIdx of [...traceIndexes]) {
        const cell = line[traceIdx];
        if (cell === undefined) throw new Error("invalid input");

        // split trace on ^
        if (cell === "^") {
          output++;
          traceIndexes.delete(traceIdx);
          if (traceIdx > 0) traceIndexes.add(traceIdx - 1);
          if (traceIdx < line.length - 1) traceIndexes.add(traceIdx + 1);

          if (traceIdx > 0) grid[lineIdx]![traceIdx - 1] = "|";
          if (traceIdx < line.length - 1) grid[lineIdx]![traceIdx + 1] = "|";
        } else {
          grid[lineIdx]![traceIdx] = "|";
        }
      }
    }
    printGrid(grid);

    return output;
  },

  async part2(_input: string) {
    const grid: string[][] = _input
      .trim()
      .split("\n")
      .map((line) => line.trim().split(""));
    if (
      grid.length === 0 ||
      !grid.every((line) => line.length === grid[0]?.length)
    ) {
      throw new Error("invalid input");
    }

    const startIdx = grid[0]?.indexOf("S");
    if (startIdx === undefined || startIdx === -1) {
      throw new Error("invalid input");
    }

    let traceCount = new Map([[startIdx, 1]]);

    for (const line of grid) {
      for (const traceIdx of [...traceCount.keys()]) {
        const cell = line[traceIdx];
        if (cell === undefined) throw new Error("invalid input");

        const streamValue = traceCount.get(traceIdx);
        if (streamValue === undefined) throw new Error("missing streamValue");

        // split trace on ^
        if (cell === "^") {
          traceCount.delete(traceIdx);
          if (traceIdx > 0) {
            const newIdx = traceIdx - 1;
            traceCount.set(newIdx, streamValue + (traceCount.get(newIdx) ?? 0));
          }
          if (traceIdx < line.length - 1) {
            const newIdx = traceIdx + 1;
            traceCount.set(newIdx, streamValue + (traceCount.get(newIdx) ?? 0));
          }
        }
      }
    }
    return Array.from(traceCount.values()).reduce((acc, val) => acc + val, 0);
  },
};

const day07: DayModule = {
  id: 7,
  title: "Laboratories",
  solver,
};

export default day07;
function printGrid(grid: string[][]) {
  console.log("0123456789");
  grid.forEach((line) => console.log(line.join("")));
}
