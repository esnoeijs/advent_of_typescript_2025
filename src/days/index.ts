import { readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { formatDayId } from "../lib/utils.js";
import type { DayModule } from "./types.js";

const registry = new Map<number, DayModule>();
let initialized = false;

/**
 * Automatically discovers and loads all dayXX.ts modules in the days directory.
 * This function is called lazily on first access to the registry.
 */
async function initializeRegistry(): Promise<void> {
  if (initialized) return;

  const currentFile = fileURLToPath(import.meta.url);
  const daysDir = dirname(currentFile);

  try {
    const files = await readdir(daysDir);

    // Filter for dayXX.ts files (or dayXX.js in built code)
    const dayFiles = files.filter((file) => {
      return /^day\d{2}\.(ts|js)$/.test(file);
    });

    // Dynamically import each day module
    for (const file of dayFiles) {
      const modulePath = join(daysDir, file);

      try {
        // Convert file path to file URL for proper ESM import
        const moduleUrl = pathToFileURL(modulePath).href;
        const module = await import(moduleUrl);
        const dayModule: DayModule = module.default;

        if (!dayModule || typeof dayModule.id !== "number") {
          console.warn(`Skipping ${file}: missing or invalid default export`);
          continue;
        }

        if (registry.has(dayModule.id)) {
          throw new Error(
            `Day ${formatDayId(dayModule.id)} is registered more than once (file: ${file})`,
          );
        }

        registry.set(dayModule.id, dayModule);
      } catch (error) {
        // Log import errors but continue loading other modules
        console.warn(
          `Failed to load ${file}:`,
          error instanceof Error ? error.message : error,
        );
      }
    }

    initialized = true;
  } catch (error) {
    throw new Error(
      `Failed to initialize day registry: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export { formatDayId };

/**
 * Returns a sorted list of all available day numbers.
 * Automatically discovers day modules on first call.
 */
export async function listAvailableDays(): Promise<number[]> {
  await initializeRegistry();
  return Array.from(registry.keys()).sort((a, b) => a - b);
}

/**
 * Retrieves the module for a specific day.
 * Automatically discovers day modules on first call.
 */
export async function getDay(day: number): Promise<DayModule | undefined> {
  await initializeRegistry();
  return registry.get(day);
}
