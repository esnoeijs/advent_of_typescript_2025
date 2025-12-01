import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { formatDayId } from "./utils.js";

export interface LoadInputOptions {
  day: number;
  cwd?: string;
  fallback?: string;
}

export function resolveInputPath(options: LoadInputOptions): string {
  const { day, cwd = process.cwd() } = options;
  return resolve(cwd, "inputs", `day${formatDayId(day)}.txt`);
}

export async function loadInput(options: LoadInputOptions): Promise<string> {
  const path = resolveInputPath(options);

  try {
    console.log(path)
    return await readFile(path, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return options.fallback ?? "";
    }

    throw error;
  }
}
