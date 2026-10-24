// Runs the tests for one task, several tasks, or all of them.
//   node run.js            all tasks
//   node run.js 03         only task 03
//   node run.js 03 07      tasks 03 and 07
//   node run.js 03 --solution   run the same tests against solutions/ (to check the reference)
import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const solution = args.includes('--solution');
const filters = args.filter((a) => !a.startsWith('--'));

const files = readdirSync(join(root, 'tests'))
  .filter((f) => f.endsWith('.test.js'))
  .filter((f) => filters.length === 0 || filters.some((p) => f.startsWith(p.padStart(2, '0'))))
  .sort()
  .map((f) => join(root, 'tests', f));

if (files.length === 0) {
  console.error(`No tests match: ${filters.join(', ')}`);
  process.exit(1);
}

// Only the latest run stays on screen.
console.clear();

const reporter = join(root, 'reporter.js');
const { status } = spawnSync(process.execPath, ['--test', `--test-reporter=${reporter}`, '--test-reporter-destination=stdout', ...files], {
  stdio: 'inherit',
  // Small heap: an endless loop fails in a second instead of eating all memory.
  env: { ...process.env, SOLUTION: solution ? '1' : '', NODE_OPTIONS: '--max-old-space-size=256' },
});
process.exit(status ?? 1);
