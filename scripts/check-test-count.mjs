import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

let output;
try {
  output = execFileSync(
    process.execPath,
    ["--disable-warning=ExperimentalWarning", "--test", "--test-reporter=tap", "tests/*.test.mjs"],
    { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
} catch (err) {
  output = err.stdout ?? "";
}

const actual = Number(output.match(/^# tests (\d+)$/m)?.[1]);
if (!actual) {
  console.error("could not read the test count out of the runner output");
  process.exit(1);
}

const files = new Map();
const read = (name) => {
  if (!files.has(name)) files.set(name, readFileSync(resolve(root, name), "utf8"));
  return files.get(name);
};

const claims = [
  ["badge", "README.md", /tests-(\d+)%20passing/],
  ["prose", "README.md", /(\d+) tests on Node's built-in runner/],
  ["layout", "README.md", /tests\/\s+(\d+) tests, no framework/],
  ["prose (tr)", "README.tr.md", /yerleşik koşucusunda (\d+) test,/],
  ["layout (tr)", "README.tr.md", /tests\/\s+(\d+) test,/],
];

const wrong = [];
for (const [where, file, re] of claims) {
  const hit = read(file).match(re);
  if (!hit) wrong.push(`${where}: the sentence this check anchors on is gone from ${file}`);
  else if (Number(hit[1]) !== actual) wrong.push(`${where}: ${file} says ${hit[1]}, the suite has ${actual}`);
}

if (wrong.length) {
  console.error(`test count drifted (${actual} tests):`);
  for (const line of wrong) console.error("  " + line);
  process.exit(1);
}

console.log(`READMEs match the suite: ${actual} tests`);
