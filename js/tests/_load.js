// Tests import the code under test through this helper:
// tasks/ by default, solutions/ when run with --solution.
export function load(name) {
  const dir = process.env.SOLUTION === '1' ? 'solutions' : 'tasks';
  return import(`../${dir}/${name}.js`);
}
