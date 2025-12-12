import type { DayModule } from "./types.js";

function createMapping(_input: string) {
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
        throw new Error(`duplicate origin: ${line}`);
      }

      legs.set(origin, dests);

      return legs;
    }, new Map<string, string[]>());

  return mapping;
}

const solver: DayModule["solver"] = {
  async part1(_input: string) {
    const mapping = createMapping(_input);
    const ENTRY = "you";
    const EXIT = "out";
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
    const mapping = createMapping(_input);
    const ENTRY = "svr";
    const EXIT = "out";
    if (!mapping.has(ENTRY)) throw new Error(`invalid _input`);

    const topoOrder: string[] = [];
    const visited = new Set<string>();

    function topoSort(node: string) {
      if (visited.has(node)) return;
      visited.add(node);

      if (node !== EXIT) {
        const nextNodes = mapping.get(node);
        if (nextNodes === undefined) {
          throw new Error(`invalid mapping for ${node}`);
        }
        for (const next of nextNodes) {
          topoSort(next);
        }
      }
      topoOrder.push(node);
    }

    // create a list of nodes that is ordered from the first node to the last node you can visit by looking
    // at the exits on each node we look at
    topoSort(ENTRY);
    topoOrder.reverse();

    type RouteKey = string & { readonly __brand: "RouteKey" };
    function createRouteKey(
      node: string,
      hasFFT: boolean,
      hasDAC: boolean,
    ): RouteKey {
      return `${node}:${hasFFT}:${hasDAC}` as RouteKey;
    }

    const pathCount: Map<RouteKey, number> = new Map();
    pathCount.set(createRouteKey(ENTRY, false, false), 1);

    console.log(topoOrder);
    for (const node of topoOrder) {
      if (node === EXIT) continue;

      const nextNodes = mapping.get(node);
      if (nextNodes === undefined) {
        throw new Error(`invalid mapping for ${node}`);
      }

      // we are looking at each node in order of when we could reach them
      // so once we get to a node there is no other combination of nodes that could have led to it so the pathCount is correct.
      //
      // we look at the 4 variants that could exist once for a given node the next node will be FFT or DAC we count it in pathCount
      // this means that while we aren't traversing paths once we get to a node that fft leads the paths count will have propogated
      for (const hasFFT of [false, true]) {
        for (const hasDAC of [false, true]) {
          const routeKey = createRouteKey(node, hasFFT, hasDAC);
          const pathsToHere = pathCount.get(routeKey) || 0;
          if (pathsToHere === 0) continue;

          for (const next of nextNodes) {
            const nextFFT = hasFFT || next === "fft";
            const nextDAC = hasDAC || next === "dac";
            const nextKey = createRouteKey(next, nextFFT, nextDAC);

            pathCount.set(nextKey, (pathCount.get(nextKey) || 0) + pathsToHere);
          }
        }
      }
    }

    return pathCount.get(createRouteKey(EXIT, true, true)) || 0;
  },
};

const day11: DayModule = {
  id: 11,
  title: "Reactor",
  solver,
};

export default day11;
