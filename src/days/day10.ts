import type { DayModule } from "./types.js";

type Machine = {
  lights: (0 | 1)[];
  buttons: Set<number>[];
  jolts: number[];
};

type Button = Set<number>;
type Jolts = number[];

function createMachines(_input: string): Machine[] {
  return _input
    .trim()
    .split("\n")
    .map((line) => {
      const lightsRegEx = String.raw`\[(?<lights>[.#]+)\]`;
      const buttonsRegEx = String.raw`(?<buttons>(?:\(\d(?:,\d)*?\) )+)`;
      const joltsRegEx = String.raw`{(?<jolts>\d+(?:,\d+)*)}`;
      const parts = line.match(
        new RegExp(`^${lightsRegEx} ${buttonsRegEx}${joltsRegEx}`),
      );

      if (
        parts === null ||
        parts.groups === undefined ||
        parts.groups["lights"] === undefined ||
        parts.groups["buttons"] === undefined ||
        parts.groups["jolts"] === undefined
      )
        throw new Error(`invalid input: ${line}`);

      return {
        lights: parts.groups["lights"]
          .split("")
          .map((x) => (x === "#" ? 1 : 0)),
        buttons: parts.groups["buttons"]
          .trim()
          .split(" ")
          .map((btnGroup) => {
            return new Set(
              btnGroup
                .substring(1, btnGroup.length - 1)
                .split(",")
                .map(Number),
            );
          }),
        jolts: parts.groups["jolts"].split(",").map(Number),
      } as Machine;
    });
}

function toggleLight(lightIdx: number, nextLightState: (0 | 1)[]) {
  let light = nextLightState[lightIdx];
  if (light === undefined)
    throw new Error(`invalid light ${lightIdx} for ${nextLightState.keys}`);
  nextLightState[lightIdx] = light === 1 ? 0 : 1;
}

function incJolts(button: Button, jolts: Jolts): Jolts {
  [...button].forEach((idx) => {
    let jolt = jolts[idx];
    if (jolt === undefined)
      throw new Error(
        `invalid increment at idx ${idx}, button:${[...button].join(",")} jolts:${jolts.join(",")}`,
      );
    jolts[idx]! += 1;
  });

  return jolts;
}

function validJolts(jolts: Jolts, maxJolts: Jolts): boolean {
  for (let [joltValue, idx] of jolts.entries()) {
    if (maxJolts[idx]! < joltValue) {
      return false;
    }
  }
  return true;
}

function sortButtonsByOptimality(
  buttons: Set<number>[],
  wrongLights: Set<number>,
): Set<number>[] {
  return buttons.sort((a, b) => {
    const wrongA = [...a].filter((btn) => !wrongLights.has(btn)).length;
    const wrongB = [...b].filter((btn) => !wrongLights.has(btn)).length;
    const rightA = [...a].filter((btn) => wrongLights.has(btn)).length;
    const rightB = [...b].filter((btn) => wrongLights.has(btn)).length;

    if (wrongA !== wrongB) {
      return wrongA - wrongB;
    }

    return rightB - rightA;
  });
}

const solver: DayModule["solver"] = {
  async part1(_input: string) {
    const machines = createMachines(_input);

    const machinesCount = machines.length - 1;
    const buttonPressCount = machines.map((machine, machineIdx) => {
      const startTime = Date.now();

      let sortedButtons = machine.buttons
        // filter out buttons that don't flip the lights we care about
        .filter((button) => {
          const activeKeys = machine.lights.reduce((acc, x, idx) => {
            if (x === 1) acc.push(idx);
            return acc;
          }, [] as number[]);

          return activeKeys.some((x) => button.has(x));
        });

      let lights = Array(machine.lights.length).fill(0) as (0 | 1)[];
      let wrongLights: Set<number> = new Set();
      lights.forEach((x, i) => {
        if (machine.lights[i] !== x) {
          wrongLights.add(i);
        }
      });
      sortedButtons = sortButtonsByOptimality(sortedButtons, wrongLights);

      const nextButtons = sortedButtons.map((button) => ({
        lights: Array(machine.lights.length).fill(0) as (0 | 1)[],
        pressed: [] as Set<number>[],
        button: button,
      }));

      let fewestButtons = Number.MAX_SAFE_INTEGER;
      while (nextButtons.length > 0) {
        const state = nextButtons.shift()!;
        const nextLightState = [...state.lights];
        const pressed = [...state.pressed, state.button];

        if (pressed.length >= fewestButtons) {
          continue;
        }

        state.button.forEach((light) => toggleLight(light, nextLightState));

        // get wrong keys
        let wrongLights: Set<number> = new Set();
        nextLightState.forEach((x, i) => {
          if (machine.lights[i] !== x) {
            wrongLights.add(i);
          }
        });

        if (wrongLights.size == 0) {
          const endTime = Date.now();
          console.log(
            `[${machineIdx}/${machinesCount}][${Math.floor((endTime - startTime) / 100)}s] found solution ` +
              `with ${state.pressed.length + 1} buttons ${pressed.map((x) => [...x].join(",")).join(" ")}`,
          );
          fewestButtons = Math.min(fewestButtons, pressed.length);
        }

        let buttons = machine.buttons
          .filter((btnSet) => [...btnSet].some((x) => wrongLights.has(x)))
          .filter(
            (btnSet) =>
              !pressed.some(
                (pressedSet) =>
                  pressedSet.size === btnSet.size &&
                  [...pressedSet].every((y) => btnSet.has(y)) &&
                  [...btnSet].every((y) => pressedSet.has(y)),
              ),
          );

        buttons = sortButtonsByOptimality(buttons, wrongLights);

        buttons.forEach((btn) => {
          nextButtons.push({
            lights: nextLightState,
            pressed: pressed,
            button: btn,
          });
        });
      }

      if (Number.MAX_SAFE_INTEGER === fewestButtons) {
        console.log(machineIdx, machine);
        throw new Error(`failed`);
      }

      return fewestButtons;
    });

    console.log(`---------------`);
    console.log(buttonPressCount);

    return buttonPressCount.reduce((acc, x) => acc + x, 0);
  },

  async part2(_input: string) {
    const machines = createMachines(_input);

    const machinesCount = machines.length - 1;
    const buttonPressCount = machines.map((machine, machineIdx) => {
      const startTime = Date.now();

      let sortedButtons = machine.buttons
        // filter out buttons that increase switches that should stay 0
        .filter((button) =>
          validJolts(
            incJolts(button, Array(machine.jolts.length).fill(0)),
            machine.jolts,
          ),
        )
        // try buttons that influince most first
        .sort((a, b) => b.size - a.size);

      const nextButtons = sortedButtons.map((button) => ({
        jolts: Array(machine.jolts.length).fill(0),
        pressed: [] as Set<number>[],
        button: button,
      }));

      let fewestButtons = Number.MAX_SAFE_INTEGER;
      let i = 100;
      console.log(`machine`, machine);
      console.log(`sortedButtons`, sortedButtons);
      while (nextButtons.length > 0) {
        if (i-- === 0) throw new Error(`bad`);
        const state = nextButtons.shift()!;

        let joltState = incJolts(state.button, [...state.jolts]);
        let pressed = [...state.pressed, state.button];

        if (
          pressed.length >= fewestButtons ||
          !validJolts(joltState, machine.jolts)
        ) {
          continue;
        }
        let maxPresses: number = Number.MAX_SAFE_INTEGER;
        [...state.button].forEach((joltIdx) => {
          //console.log(joltIdx, machine.jolts[joltIdx], machine.jolts[joltIdx]! - state.jolts[joltIdx] );
          maxPresses = Math.min(
            maxPresses,
            machine.jolts[joltIdx]! - joltState[joltIdx]!,
          );
        });
        console.log(`press button max ${maxPresses}`);

        for (let i = 0; i < maxPresses; i++) {
          joltState = incJolts(state.button, joltState);
          pressed.push(state.button);
        }

        console.log(
          `button`,
          state.button,
          `max`,
          maxPresses,
          `nextJoltState`,
          joltState,
          machine.jolts,
        );

        if (
          pressed.length >= fewestButtons ||
          !validJolts(joltState, machine.jolts)
        ) {
          continue;
        }

        // get wrong keys
        let wrongLights: Set<number> = new Set();
        joltState.forEach((x, i) => {
          if (machine.lights[i] !== x) {
            wrongLights.add(i);
          }
        });

        if (wrongLights.size == 0) {
          const endTime = Date.now();
          console.log(
            `[${machineIdx}/${machinesCount}][${Math.floor((endTime - startTime) / 100)}s] found solution ` +
              `with ${state.pressed.length + 1} buttons ${pressed.map((x) => [...x].join(",")).join(" ")}`,
          );
          fewestButtons = Math.min(fewestButtons, pressed.length);
        }

        let buttons = machine.buttons
          .filter((btnSet) => [...btnSet].every((x) => wrongLights.has(x)))
          .sort((a, b) => b.size - a.size);

        buttons.forEach((btn) => {
          nextButtons.push({
            jolts: joltState,
            pressed: pressed,
            button: btn,
          });
        });
      }

      if (Number.MAX_SAFE_INTEGER === fewestButtons) {
        console.log(machineIdx, machine);
        throw new Error(`failed`);
      }

      return fewestButtons;
    });

    console.log(`---------------`);
    console.log(buttonPressCount);

    return buttonPressCount.reduce((acc, x) => acc + x, 0);
  },
};

const day10: DayModule = {
  id: 10,
  title: "Factory",
  solver,
};

export default day10;
