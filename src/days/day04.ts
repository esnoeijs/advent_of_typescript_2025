import type { DayModule } from "./types.js";

type Position = {
  y: number;
  x: number;
};

const solver: DayModule["solver"] = {
  async part1(_input: string) {
    const rows = _input
      .trim()
      .split("\n")
      .map((line) => line.split(""));

    let accessiblePapers = 0;

    //ensure we have rectangular grid
    if (rows.length < 1) throw new Error("Invalid grid input");
    const columnCount = rows[0]?.length ?? -1;
    if (columnCount < 1 || !rows.every((row) => row.length === columnCount))
      throw new Error("Invalid grid input");

    for (const [y, row] of rows.entries()) {
      for (const [x, cell] of row.entries()) {
        let paperCount = 0;

        // only look at surrounding cells for cells with paper
        if (cell !== "@") continue;

        for (const yOffset of [-1, 0, +1]) {
          for (const xOffset of [-1, 0, +1]) {
            // skip own cell
            if (yOffset === 0 && xOffset === 0) continue;

            if (
              rows[y + yOffset] === undefined ||
              rows[y + yOffset]![x + xOffset] === undefined
            ) {
              continue;
            }
            if (rows[y + yOffset]![x + xOffset] === "@") {
              paperCount++;
            }
          }
        }

        if (paperCount < 4) {
          accessiblePapers++;
        }
      }
    }

    return accessiblePapers;
  },

  async part2(_input: string) {
    const rows = _input
      .trim()
      .split("\n")
      .map((line) => line.split(""));

    let accessiblePapers = 0;

    //ensure we have square grid
    if (rows.length < 1) throw new Error("Invalid grid input");
    const columnCount = rows[0]?.length ?? -1;
    if (columnCount < 1 || !rows.every((row) => row.length === columnCount))
      throw new Error("Invalid grid input");

    let removedCells: Position[];
    do {
      removedCells = [];
      for (const [y, row] of rows.entries()) {
        for (const [x, cell] of row.entries()) {
          let paperCount = 0;

          // only look at surrounding cells for cells with paper
          if (cell !== "@") continue;

          for (const yOffset of [-1, 0, +1]) {
            for (const xOffset of [-1, 0, +1]) {
              // skip own cell
              if (yOffset === 0 && xOffset === 0) continue;

              if (
                rows[y + yOffset] === undefined ||
                rows[y + yOffset]![x + xOffset] === undefined
              ) {
                continue;
              }
              if (rows[y + yOffset]![x + xOffset] === "@") {
                paperCount++;
              }
            }
          }

          if (paperCount < 4) {
            accessiblePapers++;
            removedCells.push({ y, x });
          }
        }
      }

      for (const pos of removedCells) {
        rows[pos.y]![pos.x] = "x";
      }
    } while (removedCells.length > 0);

    return accessiblePapers;
  },
};

const day04: DayModule = {
  id: 4,
  title: "Printing Department",
  solver,
};

export default day04;
