import { access } from "node:fs/promises";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { assetManifest } from "../src/assetManifest.js";

const projectRoot = normalize(join(dirname(fileURLToPath(import.meta.url)), ".."));
const paths = [];

collect(assetManifest);

let missing = 0;
for (const assetPath of paths) {
  const diskPath = normalize(join(projectRoot, "src", assetPath));
  try {
    await access(diskPath);
    console.log(`OK      ${assetPath}`);
  } catch {
    missing += 1;
    console.log(`MISSING ${assetPath}`);
  }
}

if (missing > 0) {
  process.exitCode = 1;
  console.log(`\nMissing assets: ${missing}`);
} else {
  console.log(`\nAll assets found: ${paths.length}`);
}

function collect(value) {
  if (typeof value === "string") {
    if (value.startsWith("../") || value.startsWith("./")) {
      paths.push(value);
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) collect(item);
    return;
  }

  if (value && typeof value === "object") {
    for (const item of Object.values(value)) collect(item);
  }
}
