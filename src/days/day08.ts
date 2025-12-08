import type { DayModule } from "./types.js";

type Box = { id: string; x: number; y: number; z: number };
type DistancePair = { a: Box; b: Box; dist: number };

function calcBoxDistance(a: Box, b: Box) {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2),
  );
}

function createJunctionBoxes(_input: string): Box[] {
  return _input
    .trim()
    .split("\n")
    .map((boxInput) => {
      const positions = boxInput.split(",").map(Number);
      if (positions.length !== 3 || positions.some((pos) => isNaN(pos))) {
        throw new Error(`invalid input: ${boxInput}`);
      }

      return {
        id: `${positions[0]},${positions[1]},${positions[2]}`,
        x: positions[0] as number,
        y: positions[1] as number,
        z: positions[2] as number,
      };
    });
}

function calcDistance(boxes: Box[]): DistancePair[] {
  const distance: DistancePair[] = [];
  for (let a = 0; a < boxes.length - 1; a++) {
    for (let b = a + 1; b <= boxes.length - 1; b++) {
      const boxa = boxes[a]!;
      const boxb = boxes[b]!;

      distance.push({ a: boxa, b: boxb, dist: calcBoxDistance(boxa, boxb) });
    }
  }
  distance.sort((a, b) => a.dist - b.dist);
  return distance;
}

const solver: DayModule["solver"] = {
  async part1(_input: string) {
    // Read pair count from environment variable, default to 1000 for actual puzzle input
    const SOLVE_PAIR_COUNT = process.env.AOC_DAY08_PAIR_COUNT
      ? parseInt(process.env.AOC_DAY08_PAIR_COUNT, 10)
      : 1000;
    const boxes: Box[] = createJunctionBoxes(_input);
    const distance = calcDistance(boxes);
    const circuits: Set<Box>[] = boxes.map((box) => new Set([box]));

    for (const distPair of distance.slice(0, SOLVE_PAIR_COUNT)) {
      const sets = circuits.filter(
        (circuit) => circuit.has(distPair.a) || circuit.has(distPair.b),
      );
      if (sets.length === 2) {
        const [c1, c2] = sets as [Set<Box>, Set<Box>];
        c1.forEach((b) => c2.add(b));
        c1.clear();
      }
    }

    return circuits
      .map((circuit) => circuit.size)
      .sort((a, b) => a - b)
      .slice(-3)
      .reduce((acc, length) => acc * length, 1);
  },

  async part2(_input: string) {
    const boxes: Box[] = createJunctionBoxes(_input);
    const distance = calcDistance(boxes);
    let circuits: Set<Box>[] = boxes.map((box) => new Set([box]));

    let result;
    for (const distPair of distance) {
      const sets = circuits.filter(
        (c) => c.has(distPair.a) || c.has(distPair.b),
      );
      if (sets.length === 2) {
        const [c1, c2] = sets as [Set<Box>, Set<Box>];
        c1.forEach((b) => c2.add(b));
        c1.clear();
      }
      circuits = circuits.filter((x) => x.size > 0);
      if (circuits.length === 1) {
        result = distPair;
        break;
      }
    }

    return result!.a.x * result!.b.x;
  },
};

const day08: DayModule = {
  id: 8,
  title: "Playground",
  solver,
};

export default day08;
