import type { DayModule } from "./types.js";

function parseRanges(_input: string) {
    return _input.split(",")
        .map(pair => {
            const pairs = pair.split("-")
                .map(x => parseInt(x, 10))
                .filter(x => !isNaN(x));

            if (pairs.length !== 2) {
                throw new Error(`Invalid input ${_input}`);
            }

            return {
              min: pairs[0] as number,
              max: pairs[1] as number
            };
        });
}

const solver: DayModule["solver"] = {
  async part1(_input: string) {
    const ranges = parseRanges(_input);

    return ranges
      .reduce((acc, range) => {
        for (let num = range.min; num <= range.max; num++) {
          const numString = num.toString();
          const numLength = numString.length;
          if (numLength % 2 === 0) {
            const halfLength = Math.floor(numLength/2);
            if (numString.substring(0, halfLength) === numString.substring(halfLength)) {
              acc += num;
            }
          }
        }
        return acc;
      }, 0);
  },

  async part2(_input: string) {
    const ranges = parseRanges(_input);

    return ranges
      .reduce((acc, range) => {
        for (let num = range['min']; num <= range['max']; num++) {

          const numString = num.toString();
          const numLength = numString.length;

          const halfLength = Math.floor(numLength/2);
          for (let splitSize = 1; splitSize <= halfLength; splitSize++) {
            const pairs = numString.match(new RegExp(`.{${splitSize}}`, 'g'));
            if (pairs === null || pairs.length !== numLength/splitSize) {
              continue;
            }
            const matchString = pairs[0];
            if (pairs.every(x => matchString === x)) {
              acc += num;
              break;
            }
          }
        }
        return acc;
      }, 0);
  },
};

const day02: DayModule = {
  id: 2,
  title: "Gift Shop",
  solver,
};

export default day02;
