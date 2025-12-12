import type { DayModule } from "./types.js";

const ENTRY = "you";
const EXIT = "out";

const solver: DayModule["solver"] = {
  async part1(_input: string) {
    const mapping = _input
      .trim()
      .split("\n")
      .reduce((legs, line) => {
        const colonIdx = line.indexOf(":");
        if (colonIdx === -1) throw new Error(`invalid input: ${line}`);
        const origin = line.substring(0, colonIdx);
        const dests = line
          .substring(colonIdx + 1)
          .trim()
          .split(" ");

        if (legs.has(origin)) {
          throw new Error(`dupplicate origin: ${line}`);
        }

        legs.set(origin, dests);

        return legs;
      }, new Map<string, string[]>());

    if (!mapping.has(ENTRY)) throw new Error(`invalid _input`);

    const visited: Map<string, number> = new Map();
    const nodes = [ENTRY];

    while (nodes.length > 0) {
      const node = nodes.shift()!;

      const visits = visited.get(node) ?? 0;
      visited.set(node, visits + 1);

      // this is the end node so no more exits
      if (node === EXIT) continue;

      const nextNodes = mapping.get(node);
      if (nextNodes === undefined) {
        throw new Error(`invalid mapping for ${node}`);
      }
      nextNodes.forEach((node) => nodes.push(node));
    }

    return visited.get(EXIT) ?? 0;
  },

  async part2(_input: string) {
    // TODO: Implement part 2
    return 0;
  },
};

const day11: DayModule = {
  id: 11,
  title: "Reactor",
  solver,
};

export default day11;
