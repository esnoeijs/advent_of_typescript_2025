import type { DayModule } from "./types.js";

type Location = { x: number; y: number };

function calcArea(a: Location, b: Location): number {
  return (Math.abs(a.x - b.x) + 1) * (Math.abs(a.y - b.y) + 1);
}

function locationToString(loc: Location): string {
  return `${loc.x},${loc.y}`;
}

function getLineTiles(tiles: Location[]): Set<string> {
  const lineTiles = new Set<string>();
  for (let idx = -1; idx <= tiles.length; idx++) {
    const tileA = tiles.at(idx);
    const nextTile = tiles.at(idx + 1);
    if (tileA === undefined || nextTile === undefined) continue;

    if (tileA.x === nextTile.x) {
      const low = Math.min(tileA.y, nextTile.y);
      const high = Math.max(tileA.y, nextTile.y);

      for (let i = low; i <= high; i++) {
        lineTiles.add(locationToString({ x: tileA.x, y: i }));
      }
    } else {
      const low = Math.min(tileA.x, nextTile.x);
      const high = Math.max(tileA.x, nextTile.x);

      for (let i = low; i <= high; i++) {
        lineTiles.add(locationToString({ x: i, y: tileA.y }));
      }
    }
  }
  return lineTiles;
}

function findOutsideTiles(maxX: number, maxY: number, fillTiles: Set<string>) {
  let explore = [{ x: 0, y: 0 }];
  const outsideTiles = new Set<string>();

  while (explore.length > 0) {
    const cell = explore.pop();
    if (cell === undefined) throw new Error("invalid state");
    outsideTiles.add(locationToString(cell));

    // add neighbours to explore
    [
      [-1, 0],
      [+1, 0],
      [0, -1],
      [0, +1],
    ].forEach((offset) => {
      const neighbour = { x: cell.x + offset[0]!, y: cell.y + offset[1]! };
      const neighbourStr = locationToString(neighbour);

      if (
        neighbour.x >= 0 &&
        neighbour.x <= maxX &&
        neighbour.y >= 0 &&
        neighbour.y <= maxY &&
        !outsideTiles.has(neighbourStr) &&
        !fillTiles.has(neighbourStr)
      ) {
        explore.push(neighbour);
      }
    });
  }
  return outsideTiles;
}

function printGrid(
  maxX: number,
  maxY: number,
  fillTiles: Set<string>,
  fooTiles: Set<string>,
) {
  console.log("print grid");
  for (let y = 0; y <= maxY; y++) {
    let line = "";
    for (let x = 0; x <= maxX; x++) {
      const cell = { x, y };
      if (fillTiles.has(locationToString(cell))) {
        line += "#";
      } else if (fooTiles.has(locationToString(cell))) {
        line += "@";
      } else {
        line += ".";
      }
    }
    console.log(line);
  }
}

function createTiles(_input: string) {
  return _input
    .trim()
    .split("\n")
    .map((line) => {
      const location = line.trim().split(",").map(Number);
      if (location.length !== 2 || location.some((x) => isNaN(x))) {
        throw new Error(`invalid input '${line}'`);
      }
      return { x: location[0] as number, y: location[1] as number };
    });
}

function decompress(
  tile: Location,
  mapXreverse: Map<number, number>,
  mapYrevese: Map<number, number>,
): Location {
  return { x: mapXreverse.get(tile.x), y: mapYrevese.get(tile.y) } as Location;
}

const solver: DayModule["solver"] = {
  async part1(_input: string) {
    const tiles = createTiles(_input);

    let maxArea = 0;
    for (let i = 0; i < tiles.length - 1; i++) {
      const tileA = tiles[i];
      if (tileA === undefined) throw new Error("invalid state");
      for (let j = i + 1; j < tiles.length; j++) {
        const tileB = tiles[j];
        if (tileB === undefined) throw new Error("invalid state");

        maxArea = Math.max(maxArea, calcArea(tileA, tileB));
      }
    }

    return maxArea;
  },

  async part2(_input: string) {
    const tiles = createTiles(_input);

    // compress grid
    const allX = Array.from(new Set(tiles.map((t) => t.x))).sort(
      (a, b) => a - b,
    );
    const allY = Array.from(new Set(tiles.map((t) => t.y))).sort(
      (a, b) => a - b,
    );

    // offset 1 to make the floodfill still work, and we blow up the compression a ittle bit to preserve gaps in the topology
    const xMap: Map<number, number> = new Map();
    const xMapReverse: Map<number, number> = new Map();
    allX.forEach((x, i) => {
      const miniX = 1 + i * 2;
      xMap.set(x, miniX);
      xMapReverse.set(miniX, x);
    });
    const yMap: Map<number, number> = new Map();
    const yMapReverse: Map<number, number> = new Map();
    allY.forEach((y, i) => {
      const miniY = 1 + i * 2;
      yMap.set(y, miniY);
      yMapReverse.set(miniY, y);
    });

    const miniTiles = tiles.map((t) => {
      return { x: xMap.get(t.x), y: yMap.get(t.y) } as Location;
    });
    const fillTiles: Set<string> = new Set();

    miniTiles.forEach((t) => fillTiles.add(locationToString(t)));
    const maxX = miniTiles.reduce((acc, t) => Math.max(acc, t.x), 0) + 2;
    const maxY = miniTiles.reduce((acc, t) => Math.max(acc, t.y), 0) + 2;

    // draw line between all points including end to start point
    getLineTiles(miniTiles).forEach((t) => fillTiles.add(t));

    // flood fill from corners to find all cells that aren't inside the polygon,
    // we can check the cells that are part of the lines to stop the flood fill.
    const outsideTiles = findOutsideTiles(maxX, maxY, fillTiles);

    for (let y = 0; y < maxY; y++) {
      for (let x = 0; x < maxX; x++) {
        const cell = locationToString({ x, y });

        if (!outsideTiles.has(cell)) {
          fillTiles.add(cell);
        }
      }
    }

    let rectangles = [];
    for (let i = 0; i < miniTiles.length - 1; i++) {
      const tileA = miniTiles[i];
      if (tileA === undefined) throw new Error("invalid state");
      for (let j = i + 1; j < miniTiles.length; j++) {
        const tileB = miniTiles[j];
        if (tileB === undefined) throw new Error("invalid state");

        rectangles.push([tileA, tileB] as [Location, Location]);
      }
    }

    console.log(`find all rectangles`);
    return rectangles
      .filter(([tileA, tileB]) => {
        const minX = Math.min(tileA.x, tileB.x);
        const maxX = Math.max(tileA.x, tileB.x);
        const minY = Math.min(tileA.y, tileB.y);
        const maxY = Math.max(tileA.y, tileB.y);

        for (let x = minX; x <= maxX; x++) {
          for (let y = minY; y <= maxY; y++) {
            if (outsideTiles.has(`${x},${y}`)) {
              return false;
            }
          }
        }
        return true;
      })
      .reduce((acc, [tileA, tileB]) => {
        const points = [
          tileA,
          { x: tileA.x, y: tileB.y },
          tileB,
          { x: tileB.x, y: tileA.y },
        ];
        const lines = getLineTiles(points);
        const maxArea = calcArea(
          decompress(tileA, xMapReverse, yMapReverse),
          decompress(tileB, xMapReverse, yMapReverse),
        );
        if (maxArea > 1588955080) {
          printGrid(maxX, maxY, new Set(lines), fillTiles);
          console.log({ maxArea });
        }

        return Math.max(acc, maxArea);
      }, 0);
  },
};

const day09: DayModule = {
  id: 9,
  title: "Movie Theater",
  solver,
};

export default day09;
