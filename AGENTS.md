# Agent Guidelines for Advent of Code

This project is an Advent of Code solution repository. The primary purpose of Advent of Code is to solve logical programming puzzles independently.

## Agent Restrictions

When working with this codebase, AI agents and assistants **MUST NOT**:

- ❌ Implement puzzle solution logic (part1 or part2 functions in `src/days/dayXX.ts`)
- ❌ Explain how to solve specific puzzle problems
- ❌ Provide algorithmic hints or approaches for puzzle solutions
- ❌ Debug or fix logic errors in puzzle solution code
- ❌ Suggest optimizations specific to puzzle-solving strategies

The solving of puzzles is the core learning experience and should remain with the human developer.

## What Agents CAN Help With

Agents **MAY** assist with:

- ✅ Code review for bugs (syntax errors, type errors, runtime crashes)
- ✅ Code quality improvements (readability, naming, structure)
- ✅ Testing infrastructure and test setup
- ✅ Build configuration and tooling issues
- ✅ CLI functionality and developer experience
- ✅ Project structure and scaffolding
- ✅ Input parsing and file I/O utilities (in `src/lib/`)
- ✅ General TypeScript/Node.js best practices
- ✅ Performance profiling tools and measurement (not solution optimization)

## Code Review Guidelines

When reviewing code, agents should:

1. **Point out bugs** - syntax errors, type mismatches, potential runtime errors
2. **Suggest quality improvements** - better variable names, clearer structure, removing duplication
3. **Avoid solution discussion** - do not comment on the correctness or efficiency of puzzle-solving algorithms
4. **Focus on maintainability** - code organization, testing patterns, error handling

## Example: What NOT to do

```typescript
// ❌ BAD: Agent implements the puzzle solution
export function part1(input: string): number {
  return input.split('\n')
    .map(line => parseInt(line.match(/\d+/)?.[0] ?? '0'))
    .reduce((sum, n) => sum + n, 0);
}
```
