import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

function walk(directory) {
  return readdirSync(directory)
    .filter((name) => name !== ".git" && name !== "node_modules")
    .flatMap((name) => {
      const path = join(directory, name);
      return statSync(path).isDirectory() ? walk(path) : [path];
    });
}

const htmlFiles = walk(".").filter((path) => path.endsWith(".html"));
const failures = [];

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, "utf8");
  const references = html.matchAll(/(?:href|src)=["']([^"']+)["']/g);

  for (const [, reference] of references) {
    if (/^(?:https?:|mailto:|tel:|#|data:)/.test(reference)) continue;

    const cleanReference = reference.split(/[?#]/, 1)[0];
    const target = resolve(dirname(htmlFile), cleanReference);
    const candidates = [target, join(target, "index.html")];

    if (!candidates.some((candidate) => existsSync(candidate))) {
      failures.push(`${htmlFile}: ${reference}`);
    }
  }
}

if (failures.length) {
  console.error("Broken local references:\n" + failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${htmlFiles.length} HTML files; all local references resolve.`);
}
