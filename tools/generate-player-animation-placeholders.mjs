import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../assets/sprites/animations/player/", import.meta.url));

const damageStyles = [
  { box: "#d3a15d", lines: "", label: "" },
  { box: "#c28a4a", lines: "<path d=\"M35 68h12M53 84h10\" stroke=\"#70462a\" stroke-width=\"4\" stroke-linecap=\"round\"/>", label: "" },
  { box: "#ad7341", lines: "<path d=\"M32 67h18M49 80h14M37 91h9\" stroke=\"#5d3824\" stroke-width=\"4\" stroke-linecap=\"round\"/>", label: "" },
  { box: "#895838", lines: "<path d=\"M31 66h21M46 78h18M34 91h22\" stroke=\"#3c281f\" stroke-width=\"5\" stroke-linecap=\"round\"/><path d=\"M61 61l6 10-8 7\" fill=\"none\" stroke=\"#3c281f\" stroke-width=\"4\"/>", label: "" }
];

const states = {
  run: { frames: 4, fps: 10 },
  "turn-left": { frames: 2, fps: 12 },
  "turn-right": { frames: 2, fps: 12 },
  hit: { frames: 2, fps: 8 }
};

for (let damage = 0; damage <= 3; damage += 1) {
  for (const [state, config] of Object.entries(states)) {
    const dir = join(root, `damage-${damage}`, state);
    await mkdir(dir, { recursive: true });
    for (let frame = 0; frame < config.frames; frame += 1) {
      await writeFile(join(dir, `frame-${frame}.svg`), makeSvg({ damage, state, frame }), "utf8");
    }
  }
}

function makeSvg({ damage, state, frame }) {
  const style = damageStyles[damage];
  const runBob = state === "run" ? [1, -2, 2, -1][frame] : 0;
  const lean = state === "turn-left" ? -7 : state === "turn-right" ? 7 : state === "hit" ? (frame === 0 ? -9 : 9) : 0;
  const armLeft = state === "turn-left" ? "M30 61 10 51" : state === "turn-right" ? "M30 61 22 43" : "M30 61 16 48";
  const armRight = state === "turn-right" ? "M66 61l20-10" : state === "turn-left" ? "M66 61l8-18" : "M66 61l14-13";
  const hitMark = state === "hit" ? "<path d=\"M20 18l8 8M28 18l-8 8M68 18l8 8M76 18l-8 8\" stroke=\"#e85d56\" stroke-width=\"4\" stroke-linecap=\"round\"/>" : "";
  const wheelOffset = state === "turn-left" ? -2 : state === "turn-right" ? 2 : 0;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="128" viewBox="0 0 96 128">
  <rect width="96" height="128" fill="none"/>
  <g transform="translate(0 ${runBob}) rotate(${lean} 48 72)" stroke="#151514" stroke-width="4" stroke-linejoin="round">
    <rect x="23" y="54" width="50" height="44" rx="7" fill="#a26b3d"/>
    <path d="M30 56h36l-7 18H37z" fill="${style.box}"/>
    ${style.lines}
    <circle cx="${30 + wheelOffset}" cy="104" r="8" fill="#2d3330"/>
    <circle cx="${66 + wheelOffset}" cy="104" r="8" fill="#2d3330"/>
    <path d="M36 50v-8c0-9 6-16 12-16s12 7 12 16v8" fill="#57c7a2"/>
    <circle cx="48" cy="23" r="13" fill="#f0c15a"/>
    <path d="${armLeft}${armRight}" fill="none" stroke-linecap="round"/>
    <path d="M41 82h14" stroke="#f4f1e8" stroke-linecap="round"/>
    ${hitMark}
  </g>
</svg>
`;
}
