import { readFile } from "node:fs/promises";
import process from "node:process";

import { formatDayId, getDay, listAvailableDays } from "./days/index.js";
import { loadInput } from "./lib/input.js";

const PARTS = new Set([1, 2] as const);

type PartNumber = 1 | 2;

type CliOptions = {
  help?: boolean;
  list?: boolean;
  day?: number;
  part?: PartNumber;
  inputPath?: string;
  verbose?: boolean;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg) continue;

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--list") {
      options.list = true;
      continue;
    }

    if (arg === "--verbose" || arg === "-v") {
      options.verbose = true;
      continue;
    }

    if (arg.startsWith("--day=")) {
      options.day = Number.parseInt(arg.slice("--day=".length), 10);
      continue;
    }

    if (arg === "--day" && i + 1 < argv.length) {
      const nextArg = argv[i + 1];
      if (nextArg) {
        options.day = Number.parseInt(nextArg, 10);
        i += 1;
      }
      continue;
    }

    if (arg.startsWith("--part=")) {
      options.part = parsePart(arg.slice("--part=".length));
      continue;
    }

    if (arg === "--part" && i + 1 < argv.length) {
      const nextArg = argv[i + 1];
      if (nextArg) {
        options.part = parsePart(nextArg);
        i += 1;
      }
      continue;
    }

    if (arg.startsWith("--input=")) {
      options.inputPath = arg.slice("--input=".length);
      continue;
    }

    if (arg === "--input" && i + 1 < argv.length) {
      const nextArg = argv[i + 1];
      if (nextArg) {
        options.inputPath = nextArg;
        i += 1;
      }
    }
  }

  return options;
}

function parsePart(raw: string): PartNumber | undefined {
  const value = Number.parseInt(raw, 10);

  return PARTS.has(value as PartNumber) ? (value as PartNumber) : undefined;
}

function printHelp(): void {
  console.log(`Usage: aoc-typescript-2025 [options]\n\n`
    + `Options:\n`
    + `  -h, --help            Show this message\n`
    + `      --list            List the available days\n`
    + `      --day <n>         Select the day to run (defaults to latest)\n`
    + `      --part <1|2>      Run only a single part (defaults to both)\n`
    + `      --input <path>    Override input file path\n`
    + `  -v, --verbose         Show detailed error messages with stack traces`);
}

function printAvailableDays(days: number[]): void {
  if (days.length === 0) {
    console.log("No days available yet. Add files under src/days/dayXX.ts to get started.");
    return;
  }

  console.log(`Available days: ${days.map(formatDayId).join(", ")}`);
}

function formatError(error: unknown, verbose: boolean): string {
  if (error instanceof Error) {
    if (verbose && error.stack) {
      return error.stack;
    }
    return error.message;
  }
  return String(error);
}

async function runCLI(): Promise<number> {
  const [, , ...argv] = process.argv;
  const options = parseArgs(argv);

  const availableDays = await listAvailableDays();

  if (options.help) {
    printHelp();
    return 0;
  }

  if (options.list) {
    printAvailableDays(availableDays);
    return 0;
  }

  if (availableDays.length === 0) {
    console.error("No AoC days found. Add files under src/days/dayXX.ts to continue.");
    return 1;
  }

  const lastDay = availableDays[availableDays.length - 1];
  if (lastDay === undefined) {
    console.error("No AoC days found. Add files under src/days/dayXX.ts to continue.");
    return 1;
  }

  const targetDay = options.day ?? lastDay;

  if (!Number.isInteger(targetDay) || targetDay < 1 || targetDay > 25) {
    console.error("Invalid day provided. Expected an integer between 1 and 25.");
    return 1;
  }

  const module = await getDay(targetDay);

  if (!module) {
    console.error(`Day ${formatDayId(targetDay)} is not implemented yet.`);
    return 1;
  }

  const partsToRun = options.part ? [options.part] : [1, 2];

  const input = options.inputPath
    ? await readFile(options.inputPath, "utf8")
    : await loadInput({ day: targetDay, cwd: process.cwd(), fallback: "" });

  let exitCode = 0;

  for (const part of partsToRun) {
    const solver = part === 1 ? module.solver.part1 : module.solver.part2;

    try {
      const result = await solver(input);
      console.log(`Day ${formatDayId(targetDay)} Part ${part}: ${String(result)}`);
    } catch (error) {
      exitCode = 1;
      const errorMessage = formatError(error, options.verbose ?? false);
      console.error(`Error running Day ${formatDayId(targetDay)} Part ${part}:`);
      console.error(errorMessage);
    }
  }

  return exitCode;
}

void runCLI().then((code) => {
  process.exitCode = code;
}).catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
