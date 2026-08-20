#!/usr/bin/env node
/**
 * Prints the project's stack summary.
 *
 * This exists because the summary kept being written down by hand and kept
 * going stale within the hour — a file count in prose is wrong the moment
 * anyone adds a file. Run `npm run stats` and paste the output instead.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["src", "tests"];
const pkg = JSON.parse(readFileSync("package.json", "utf8"));

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

const files = ROOTS.flatMap((r) => walk(r));
const count = (ext) => files.filter((f) => extname(f) === ext).length;
const lines = (paths) =>
  paths.reduce((n, f) => n + readFileSync(f, "utf8").split("\n").length, 0);

const tsx = files.filter((f) => extname(f) === ".tsx");
const ts = files.filter((f) => extname(f) === ".ts");
const css = lines(["src/app/globals.css"]);

// Route files are the honest measure of "how many pages", not folder count.
const routes = files.filter((f) => /(\/page|\/route)\.tsx?$/.test(f)).length;

const rows = [
  ["Language", `TypeScript — ${count(".tsx")} .tsx + ${count(".ts")} .ts files`],
  ["Framework", `Next.js ${pkg.dependencies.next}, App Router`],
  ["UI", `React ${pkg.dependencies.react}`],
  ["Styling", `One hand-written globals.css, ${css} lines (no Tailwind/CSS-in-JS)`],
  ["Code", `${lines(tsx) + lines(ts)} lines TS/TSX, ${css} lines CSS`],
  ["Routes", `${routes} page/route files, 2 locales`],
  ["Runtime deps", Object.keys(pkg.dependencies).join(", ")],
];

const width = Math.max(...rows.map(([k]) => k.length));
for (const [k, v] of rows) console.log(`${k.padEnd(width)}  ${v}`);
