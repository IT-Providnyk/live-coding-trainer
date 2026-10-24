// Short test output for run.js: one line per test, and for a failed test only
// what matters (expected vs received, or the error and the line in your file).
// No stack traces from node internals. console.log from your code is shown.
import { basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspect, styleText } from 'node:util';

const root = process.cwd();
const green = (s) => styleText('green', s);
const red = (s) => styleText('red', s);
const dim = (s) => styleText('dim', s);
const bold = (s) => styleText('bold', s);

const show = (value) => inspect(value, { depth: 6, breakLength: Infinity, compact: true });
const short = (path) => relative(root, path.startsWith('file://') ? fileURLToPath(path) : path);
const taskName = (file) => basename(file, '.test.js');

// The first line of the stack that points into tasks/ or solutions/.
const whereInCode = (error) => {
  const line = String(error?.stack ?? '')
    .split('\n')
    .find((l) => /[/\\](tasks|solutions)[/\\]/.test(l));
  const match = line?.match(/((?:file:\/\/)?\/[^\s)]+):(\d+):\d+/);
  return match ? `${short(match[1])}:${match[2]}` : null;
};

const describe = (failure) => {
  // node:test wraps the real error in ERR_TEST_FAILURE.
  const error = failure?.cause ?? failure;
  const compares = ['deepStrictEqual', 'strictEqual', 'deepEqual', 'equal'];
  if (error?.code === 'ERR_ASSERTION' && compares.includes(error.operator)) {
    return [`${dim('очікувалось:')} ${green(show(error.expected))}`, `${dim('отримано:   ')} ${red(show(error.actual))}`];
  }
  // assert.throws got a different error, e.g. "Not implemented".
  const real = error?.code === 'ERR_ASSERTION' && error.actual instanceof Error ? error.actual : error;
  const where = whereInCode(real);
  const message = real?.name && real?.message ? `${real.name}: ${real.message}` : String(real?.message ?? real);
  return [red(message), ...(where ? [dim(`у ${where}`)] : [])];
};

// Why a whole test file crashed: node prints it to stderr of the child process.
const crashReason = (stderr) => {
  if (/heap out of memory/.test(stderr)) {
    return [red('Не вистачило памʼяті: схоже на нескінченний цикл або рекурсію')];
  }
  const lines = [];
  for (const line of stderr.split('\n')) {
    if (/^\s+at /.test(line) || /^Node\.js v/.test(line)) break;
    if (!line.trim()) continue;
    lines.push(line.startsWith('file://') ? dim(`у ${short(line.replace(/:(\d+)$/, '')) + line.match(/:\d+$/)?.[0]}`) : line);
  }
  return lines.length ? lines : [red('файл не запустився')];
};

export default async function* reporter(source) {
  let file = null;
  let passed = 0;
  let failed = 0;
  const stderr = new Map();

  const header = function* (next) {
    if (next === file) return;
    file = next;
    yield `\n${bold(taskName(file))}\n`;
  };

  for await (const { type, data } of source) {
    if (type === 'test:stdout') {
      yield* header(data.file);
      yield dim(`  │ ${data.message.replace(/\n$/, '').replaceAll('\n', '\n  │ ')}`) + '\n';
      continue;
    }
    if (type === 'test:stderr') {
      stderr.set(data.file, (stderr.get(data.file) ?? '') + data.message);
      continue;
    }
    if (type !== 'test:pass' && type !== 'test:fail') continue;

    // The per-file event: it only repeats its tests, unless the file crashed.
    if (data.name === short(data.file) || data.name === data.file) {
      const error = data.details?.error;
      if (type === 'test:fail' && error?.failureType !== 'subtestsFailed') {
        failed += 1;
        yield* header(data.file);
        yield `  ${red('✗ файл не запустився')}\n`;
        for (const line of crashReason(stderr.get(data.file) ?? '')) yield `      ${line}\n`;
      } else if (stderr.get(data.file)) {
        // console.error from your code.
        yield* header(data.file);
        yield dim(`  │ ${stderr.get(data.file).replace(/\n$/, '').replaceAll('\n', '\n  │ ')}`) + '\n';
      }
      stderr.delete(data.file);
      continue;
    }

    yield* header(data.file);
    if (type === 'test:pass') {
      passed += 1;
      yield `  ${green('✓')} ${data.name}\n`;
    } else {
      failed += 1;
      yield `  ${red('✗')} ${data.name}\n`;
      for (const line of describe(data.details?.error)) yield `      ${line}\n`;
    }
  }

  const total = passed + failed;
  const summary = failed === 0 ? green(`Усі ${total} тестів пройдено`) : `${red(`Не пройдено ${failed}`)} з ${total}`;
  yield `\n${bold(summary)}\n`;
}
