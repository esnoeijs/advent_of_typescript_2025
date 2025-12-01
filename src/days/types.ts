export type DayResult = string | number | bigint;

export interface DaySolver {
  part1(input: string): DayResult | Promise<DayResult>;
  part2(input: string): DayResult | Promise<DayResult>;
}

export interface DayModule {
  id: number;
  solver: DaySolver;
  title?: string;
}
