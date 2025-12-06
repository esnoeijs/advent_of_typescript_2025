import type { DayModule } from "./types.js";

type Operation = "*" | "+";
const OPERATIONS: Operation[] = ["*", "+"] as const;

const isOperation = (value: unknown): value is Operation => {
  return OPERATIONS.includes(value as Operation);
};

function applyOperation(operation: Operation, columns: number[]) {
  switch (operation) {
    case "*":
      return columns.reduce((acc, x) => acc * x, 1);
    case "+":
      return columns.reduce((acc, x) => acc + x, 0);
  }
}

const solver: DayModule["solver"] = {
  async part1(_input: string) {
    // rows per column of characters
    const rows = _input
      .trim()
      .split("\n")
      .map((line) => line.trim().split(/\s+/));

    const columns: number[][] = [];
    let output = 0;
    for (const row of rows) {
      for (const [columnIdx, element] of row.entries()) {
        if (isOperation(element)) {
          const column = columns[columnIdx];
          if (column === undefined) throw new Error("invalid input");
          output += applyOperation(element, column);
        } else {
          if (columns[columnIdx] === undefined) {
            columns[columnIdx] = [];
          }
          columns[columnIdx].push(Number(element));
        }
      }
    }

    return output;
  },

  async part2(_input: string) {
    // rows per character
    const rows = _input
      .trim()
      .split("\n")
      .map((line) => line.split(""));

    let output = 0;

    const maxColIdx =
      rows.reduce((acc, row) => Math.max(acc, row.length), 0) - 1;
    const operationRow = rows.splice(-1).flatMap((x) => x);

    let formulaQueue: number[] = [];
    for (let colIdx = maxColIdx; colIdx >= 0; colIdx--) {
      let numStr = "";
      for (const row of rows) {
        const element = row[colIdx];
        if (element === undefined) continue;
        if (element >= "0" && element <= "9") {
          numStr += element;
        }
      }

      if (numStr.length > 0) {
        formulaQueue.push(Number(numStr));
      }

      const operation = operationRow[colIdx];
      if (isOperation(operation)) {
        output += applyOperation(operation, formulaQueue);
        formulaQueue = [];
      }
    }

    return output;
  },
};

const day06: DayModule = {
  id: 6,
  title: "Day 6",
  solver,
};

export default day06;
