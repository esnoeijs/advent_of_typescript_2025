import type { DayModule } from "./types.js";

const solver: DayModule["solver"] = {
  async part1(_input: string) {
    if (_input.match(/[^\d\n]/)) {
      throw new Error(
        `invalid input only allow digits and newlines: ${_input}`,
      );
    }

    const banks = _input.trim().split("\n");

    return banks.reduce((acc, bank) => {
      let maxJoltage = 0;
      for (let left = 0; left < bank.length; left++) {
        for (let right = left + 1; right < bank.length; right++) {
          const joltage = parseInt(
            `${bank.charAt(left)}${bank.charAt(right)}`,
            10,
          );
          maxJoltage = Math.max(maxJoltage, joltage);
        }
      }

      return acc + maxJoltage;
    }, 0);
  },

  async part2(_input: string) {
    if (_input.match(/[^\d\n]/)) {
      throw new Error(
        `invalid input only allow digits and newlines: ${_input}`,
      );
    }

    // we are looking for a 12 digit Jolt number
    const MAX_SLOTS = 12;
    const MAX_SLOT_INDEX = MAX_SLOTS - 1;

    const banks = _input.trim().split("\n");

    return banks.reduce((acc, bank) => {
      // loop over each digit slot from left to right
      // if all but last digit hits a lower digit skip loop <-- optimisation
      // we need to move the 11th slot forward until it is at the last position of the bank
      //
      // starting from the right, if a slot is at its last available index look at the next slot
      // when incrementing a slot index, reset all the slots to the left each one one further then that one
      // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15]
      // slot 11 is at its last possible position so we move slot 10
      // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 15]
      // ...
      // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 14, 15]
      // slot 11 and 10 are at the last possible position
      // so move 10 to its next position and reset the slots next to it to the next available slot after that
      // [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12]
      // [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 13]
      // [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 14]
      // [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 15]
      // [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 13]

      let maxJoltage = 0;
      const lastSlot = bank.length - 1;
      const joltageIdx: number[] = Array.from(
        { length: MAX_SLOTS },
        (_, i) => i,
      );
      let pointer = MAX_SLOT_INDEX;

      const lastPossibleIdxCombi = Array.from(
        { length: MAX_SLOTS },
        (_, i) => lastSlot - (MAX_SLOT_INDEX - i),
      ).join(",");

      while (joltageIdx.join(",") !== lastPossibleIdxCombi) {
        // each slot will have a different last valid index because while the last slot can be 15, the second to last slot can only be 14
        const lastValidIndex = lastSlot - (MAX_SLOT_INDEX - pointer);

        if (joltageIdx[pointer]! < lastValidIndex) {
          let idxPosition = joltageIdx[pointer]!;

          // We look at the next digit for this slot
          // if the digit is lower or equal to the current jolt digit in this position
          // we keep skipping until we find a higher digit or reach the last position
          const currentDigit = bank.charAt(idxPosition);
          while (
            idxPosition < lastValidIndex &&
            bank.charAt(idxPosition) <= currentDigit
          ) {
            idxPosition++;
          }

          // setting slot positions
          joltageIdx[pointer] = idxPosition;
          while (pointer < MAX_SLOT_INDEX) {
            pointer++;
            idxPosition++;
            joltageIdx[pointer] = idxPosition;
          }
        } else {
          pointer--;
          // can't happen but safety
          if (pointer < 0) {
            throw new Error("invalid pointer state");
          }
        }

        const joltage = parseInt(
          joltageIdx.map((slotIdx) => bank.charAt(slotIdx)).join(""),
          10,
        );
        if (isNaN(joltage)) {
          throw new Error(`invalid number found`);
        }
        maxJoltage = Math.max(maxJoltage, joltage);
      }

      return acc + maxJoltage;
    }, 0);
  },
};

const day03: DayModule = {
  id: 3,
  title: "Lobby",
  solver,
};

export default day03;
