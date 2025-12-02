import type { DayModule } from "./types.js";

const solver: DayModule["solver"] = {
  async part1(_input: string) {
    const res = _input.trim().split("\n")
      .reduce((acc, instruction) => {
        const isClockwise = instruction.charAt(0) === "R";
        const value = parseInt(instruction.substring(1), 10);

        acc.pos = isClockwise ? acc.pos + value : acc.pos - value;
        acc.pos = acc.pos % 100;
        if (acc.pos < 0) acc.pos += 100;

        if (acc.pos === 0) {
          acc.countZero += 1;
        }

        return acc;
      }, { pos: 50, countZero: 0 } );

    return res.countZero;
  },

  async part2(_input: string) {
    const res = _input.trim().split("\n")
      .reduce((acc, instruction) => {
        const isClockwise = instruction.charAt(0) === "R";
        const value = parseInt(instruction.substring(1), 10);

        const rotation = isClockwise ? value : -value;
        const partialRotation = rotation % 100;

        // Every full rotation is a click
        acc.countZero += Math.floor(Math.abs(rotation) / 100);

        // if our total rotation falls on 100 or beyond that's a click
        // if our total rotation moves below 0 and the position wasn't 0 itself, that's a click
        if ((partialRotation > 0 && partialRotation + acc.pos >= 100) ||
            (partialRotation < 0 && partialRotation + acc.pos <= 0 && acc.pos > 0)) {
          acc.countZero++;
        }

        acc.pos += partialRotation;
        acc.pos = acc.pos % 100;
        if (acc.pos < 0) acc.pos += 100;

        return acc;
      }, { pos: 50, countZero: 0 } );

    return res.countZero;
  },
};

const day01: DayModule = {
  id: 1,
  title: "Secret Entrance",
  solver,
};

export default day01;
